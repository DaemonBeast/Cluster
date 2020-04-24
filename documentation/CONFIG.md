# Configuration Documentation

## Table of Contents

 - [**port.json**](#portjson)
   - [*HTTP*](#http)
     - [IP](#ip-string)
     - [Port](#port-integer)
   - [*HTTPS*](#https)
     - [IP](#ip-string-1)
     - [Port](#port-integer-1)
 - [**ssl.json**](#ssljson)
   - [domains](#domains-array)
   - [autoGenerate](#autogenerate-boolean)
   - [renewUponRestart](#renewuponrestart-boolean)
   - [renewUponExpiry](#renewuponexpiry-boolean)

## port.json

### HTTP

#### IP `string`

The IP address that should be used by the server for HTTP connections.

**Default:** `"0.0.0.0"`

---

#### Port `integer`

The port that should be used by the server for HTTP connections.

**Default:** `80`

---

### HTTPS

#### IP `string`

The IP address that should be used by the server for HTTPS connections.

**Default:** `"0.0.0.0"`

---

#### Port `integer`

The port that should be used by the server for HTTPS connections.

**Default:** `443`

## ssl.json

#### domains `array`

A list of domains that point to the server. SSL certificates are generated for these domains if *autoGenerate* is set to *true* and either *renewUponRestart* or *renewUponExpiry* is set to *true*.

> **Example configuration**
>
> ```
> "domains":
> [
>     "example.com",              // supported
>     "www.example.com"           // supported
>     "subdomain.example.com"     // subdomains not supported - DO NOT USE
>     "*.example.com"             // wildcard domains not supported - DO NOT USE
> ]
> ```

**Default:** *none*

---

#### autoGenerate `boolean`

Whether Let's Encrypt SSL certificates should automatically be generated for the domains supplied in the *domains* array.

**Default:** `true`

---

#### renewUponRestart `boolean`

Whether new SSL certificates should be generated every time the server restarts. **If the server restarts often, it is advisable to set *renewUponRestart* to false to prevent the [rate limit](https://letsencrypt.org/docs/rate-limits/) from being reached**.

**Default:** `false`

---

#### renewUponExpiry `boolean`

Whether new SSL certificates should be generated when the current SSL certificates have expired. **If *renewUponRestart* is set to *false*, this should be set to *true***.

**Default:** `true`