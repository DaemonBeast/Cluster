// SSL.js v1.0.0

const FS = require('fs'),
      ACME = require('acme-client');

async function generate(config) {
    let client = new ACME.Client({
        directoryUrl: ACME.directory.letsencrypt.production,
        accountKey: await ACME.forge.createPrivateKey(4096)
    });

    let [ key, csr ] = await ACME.forge.createCsr({
        commonName: config.domains[0],
        altnames: config.domains
    });

    let cert = await client.auto({
        csr,
        email: 'zera-ora@tuta.io',
        termsOfServiceAgreed: true,
        challengeCreateFn: createChallenge,
        challengeRemoveFn: removeChallenge
    });

    if (!FS.existsSync('./data/ssl')) {
        FS.mkdirSync('./data/ssl', { recursive: true });
    }

    await Promise.all([
        FS.promises.writeFile('./data/ssl/csr.pem', csr),
        FS.promises.writeFile('./data/ssl/key.pem', key),
        FS.promises.writeFile('./data/ssl/cert.pem', cert)
    ]);

    return { csr, key, cert };
}

function createChallenge(auth, challenge, key) {
    if (!FS.existsSync('./data/tmp/acme')) {
        FS.mkdirSync('./data/tmp/acme', { recursive: true });
    }

    FS.writeFileSync(`./data/tmp/acme/${challenge.token}`, key);
}

function removeChallenge(auth, challenge, key) {
    FS.unlinkSync(`./data/tmp/acme/${challenge.token}`);
}

async function check(config) {
    if (config.autoGenerate === true) {
        if (FS.existsSync('./data/ssl/cert.pem')) {
            if (config.renewUponRestart === true) {
                return await generate(config);
            } else {
                if (config.renewUponExpiry === true) {
                    let cert = FS.readFileSync('./data/ssl/cert.pem');
                    let expiry = (new Date((await ACME.forge.readCertificateInfo(cert)).notAfter)).valueOf();
                    let date = (new Date()).valueOf();

                    if (date >= expiry) {
                        return await generate(config);
                    }
                }
            }
        } else {
            return await generate(config);
        }
    }

    let csr = FS.readFileSync('./data/ssl/csr.pem');
    let key = FS.readFileSync('./data/ssl/key.pem');
    let cert = FS.readFileSync('./data/ssl/cert.pem');

    return { csr, key, cert };
}

module.exports = check;