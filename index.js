/`* eslint-env node */
var through = require('through2');
var path = require('path');
var Vinyl = require('vinyl');
var crypto = require('crypto');

var getCommonHash = (string) => {
  var timeStamp = Date.now() + '';
  return crypto
    .createHash('md5')
    .update(string || timeStamp)
    .digest('hex');
};

function gulpRevision(version) {
  if (!version) {
    version = getCommonHash();
  }
  return through.obj((file, _, cb) => {
    var dirname = path.dirname(file.relative);
    var extname = path.extname(file.relative);
    var basename = path.basename(file.relative, extname);
    var fileName = basename + extname;
    var sourceMapNameRex = /([^.]+)(\..+)/;

    // 如果是sourceMap 特殊处理一下, 只打标签, 不进manifest
    if (extname === '.map') {
      var match = fileName.match(sourceMapNameRex);
      if (match.length === 3) {
        basename = match[1];
        extname = match[2];
      }
    } else {
      // 打标记 manifest需要用
      file.isRevision = true;
    }
    var newPath = path.join(dirname, `${basename}-${version}${extname}`);
    file.path = path.join(file.base, newPath);
    file.originFileName = `${basename}${extname}`;
    file.revision = version;
    cb(null, file);
  });
}

gulpRevision.manifest = (fileName) => {
  fileName = fileName || `manifest.json`;
  var manifestMap = {};
  return through.obj(
    (file, _, cb) => {
      if (file.isRevision) {
        manifestMap[file.originFileName] = file.relative;
        if (!manifestMap.version) {
          manifestMap.version = file.revision;
        }
      }
      cb();
    },
    function(cb) {
      if (!Object.keys(manifestMap).length) {
        cb();
        return;
      }
      var file = new Vinyl({
        path: fileName,
      });
      file.contents = Buffer.from(JSON.stringify(manifestMap, null, '  '));
      this.push(file);
      cb();
    }
  );
};

gulpRevision.getCommonHash = () => getCommonHash();

module.exports = gulpRevision;
