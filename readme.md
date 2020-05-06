# gulp-revision-hash
> inspired by gulp-rev
add content hash to asset filenames like: `xxx.js` => `xxx_aobusk12soi3.js`

## install

```shell
$ npm install --save-dev gulp-revision-hash
```

## usage

add content hash to filenames
```js
const gulp = require('gulp');
const rev = require('gulp-revision-hash');

exports.default = () => (
	gulp.src('src/*.js')
		.pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest('manifest.json'))
    .pipe(gulp.dest('dist'));
);
```

## create a simple hash
```js
const hash = rev.getCommonHash('any string');
```

## API

#### rev(hash)
*hash*

Type: `string`

Default: radom hash

#### ref.manifest(path)
*path*

Type: `string`

Default: `manifest.json` 


#### rev.getCommonHash(hashString)
*hashString*

Type: `string`

Default: `Date.now()` 