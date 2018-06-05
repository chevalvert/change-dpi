# change-dpi [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
> provide a RESTful interface to imagemagick's density method

<br>

## Installation

```sh
$ git clone https://github.com/chevalvert/change-dpi
$ cd change-dpi
$ yarn install
```

## Development

```sh
$ yarn start
> $ NODE_ENV=development node index.js
> Server is listenning on http://192.168.1.54:8888
```

## Usage

### Launch

```sh
$ node change-dpi
> Server is listenning on http://192.168.1.54:8888
```

### API Endpoints

#### `GET /api/ping`

###### response
A `200` HTTP status code with the following JSON document:
```json
{
  "version": "major.minor.patch"
}
```

###### example

```sh
$ curl -X GET http://localhost:8888/api/ping
> {"version":"1.0.0"}%
```

#### `POST /api/dpi/<dpi>/<?format>`

###### request

The api expects the request body to be a `multipart/form-data` encoded form data.  
The `<format>` argument is optionnal.

###### response

A `201` HTTP status code with the resulting file attached to the response (see [expressjs#res.download](https://expressjs.com/en/api.html#res.download)).

In case of an error, the api will return a `500` HTTP status code with the following JSON document:
```json
{
  "error": "error message"
}
```

###### example
```html
<html>
  <body>
    <form
      action='http://localhost:8888/api/dpi/300/pdf'
      method='post'
      encType="multipart/form-data">
        <input type="file" name="inputFile" />
        <input type='submit' value='convert' />
    </form>
  </body>
</html>
```

## Configuration

`change-dpi` use a `.env` file for configuration. See [.env.example](.env.example).

## License
[MIT.](https://tldrlegal.com/license/mit-license)
