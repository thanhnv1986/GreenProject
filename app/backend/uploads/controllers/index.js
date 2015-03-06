/**
 * Created by thanhnv on 2/2/15.
 */
var fs = require('fs'),
    sizeOf = require('image-size'),
    im = require('imagemagick'),
    moment = require('moment'),
    formidable = require('formidable'),
    path = require('path');
var rootPath = '/fileman/Uploads';
var standardPath = __base + 'public/';
exports.dirtree = function (req, res) {
    var results = [];
    getDirectories(rootPath, results);
    res.jsonp(results);
};

exports.createdir = function (req, res) {
    var dir = req.param('d');
    var name = req.param('n');
    fs.mkdir(standardPath + dir + '/' + name, '7777', function (err) {
        if (err) {
            throw err;
        }
        else {
            res.jsonp({"res": "ok", "msg": ""});
        }
    });

};
exports.deletedir = function (req, res) {
    var dir = req.param('d');

    fs.rmdir(standardPath + dir, function (err) {
        if (err) {
            res.jsonp({"res": "error", "msg": "Không thể xóa thư mục khi vẫn còn file tồn tại trong thư mục"});
        }
        else {
            res.jsonp({"res": "ok", "msg": ""});
        }
    });
};
exports.movedir = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.copydir = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.renamedir = function (req, res) {
    var d = req.param('d');
    var n = req.param('n');
    var path = d.substring(0, d.lastIndexOf('/'));
    fs.renameSync(standardPath + d, standardPath + path + '/' + n);
    res.jsonp({"res": "ok", "msg": ""});
};
exports.fileslist = function (req, res) {
    var folder = req.param('d');
    var type = req.param('type');
    var rPath = standardPath + folder;
    fs.readdir(rPath, function (err, files) {
        if (err) {
        }
        else {
            var result = [];
            for (var i in files) {
                var filePath = rPath + '/' + files[i];
                if (checkFileType(filePath) == "image") {
                    var sta = fs.statSync(filePath);
                    if (sta.isFile()) {

                        var dimension = sizeOf(filePath);
                        var p = {
                            p: folder + "/" + files[i],
                            s: sta.size,
                            t: new Date(sta.mtime).getTime() / 1000,
                            w: dimension.width,
                            h: dimension.height
                        }
                        result.push(p);
                    }
                }
            }
            res.jsonp(result);
        }
    });
};
exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        folder = fields.d;
        console.log(fields, files);
        fs.rename(files["files[]"].path, folder_to_upload + '/' + files["files[]"].name, function (err) {
            if (err) {
                console.log(err);
            }
            else {

            }
        });
    });
    form.on('end', function() {
        res.jsonp({"res": "ok", "msg": ""});
    });
    /*var fstream;
     var folder;
     req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
     if (key == 'd') {
     folder = value;
     }
     });
     req.busboy.on('file', function (fieldname, file, filename) {

     console.log(req.param(fieldname), filename, req.body);
     if (filename != "") {
     var folder_to_upload = standardPath + folder;
     fstream = fs.createWriteStream(folder_to_upload + '/' + filename);
     file.pipe(fstream);
     fstream.on('close', function () {

     });
     }
     else {
     file.resume();
     }

     });
     req.busboy.on('finish', function () {
     res.jsonp({"res": "ok", "msg": ""});
     });
     req.pipe(req.busboy);*/
    //res.jsonp({"res":"error", "msg":"Chưa tích hợp"});
};
exports.download = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.downloaddir = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.deletefile = function (req, res) {
    var file = req.param('f');
    if (fs.existsSync(standardPath + file)) {
        fs.unlink(standardPath + file, function (err) {
            if (err) {
                throw err;
            }
            else {
                var tmp = getFileName(file);
                var tmp_path = standardPath + '/fileman/tmp/' + tmp;
                if (fs.existsSync(tmp_path)) {
                    fs.unlinkSync(standardPath + '/fileman/tmp/' + tmp);
                }
            }
            res.jsonp({"res": "ok", "msg": ""});
        });
    } else {
        res.jsonp({"res": "ok", "msg": ""});
    }

};
exports.movefile = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.copyfile = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};
exports.renamefile = function (req, res) {
    var f = req.param('f');
    var n = req.param('n');
    var path = f.substring(0, f.lastIndexOf('/'));
    fs.renameSync(standardPath + f, standardPath + path + '/' + n);
    //change name of thumb tmp
    var tmp = getFileName(f);
    var tmp_path = standardPath + '/fileman/tmp/' + tmp;
    if (fs.existsSync(tmp_path)) {
        fs.renameSync(tmp_path, standardPath + '/fileman/tmp/' + n);
    }
    res.jsonp({"res": "ok", "msg": ""});
};
exports.thumb = function (req, res) {
    var filePath = req.param('f');
    var width = req.param('width');
    var height = req.param('height');
    var tmpFolder = standardPath + '/fileman/tmp';
    //Kiem tra xem file da ton tai chua
    //Neu ton tai roi thi tra ve
    //Chua ton tai thi tao file thumb
    var filename = getFileName(filePath);
    if (fs.existsSync(tmpFolder + '/' + filename)) {
        var img = fs.readFileSync(tmpFolder + '/' + filename);
        res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename) });
        res.end(img, 'binary');
    }
    else {
        im.resize({
            srcPath: standardPath + filePath,
            dstPath: tmpFolder + '/' + filename,
            width: width,
            height: height
        }, function (err, stdout, stderr) {
            if (err) throw err;
            console.log('resized image to fit');
            var img = fs.readFileSync(tmpFolder + '/' + filename);
            res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename) });
            res.end(img, 'binary');
        });
    }

};
function getFileName(path) {
    return path.replace(/^.*[\\\/]/, '');
}
function checkFileType(path) {
    if (~path.indexOf('.png') || ~path.indexOf('.jpg') || ~path.indexOf('.gif') || ~path.indexOf('.jpeg')) {
        return "image";
    }
    else {
        return "un-know";
    }

}
function getExtension(path) {
    return path.split('.').pop();
}
function getDirectories(srcpath, results) {
    var files_and_dirs = fs.readdirSync(standardPath + srcpath);
    var totalSubFolders = 0;
    var totalSubFiles = 0;
    var dirs = files_and_dirs.filter(function (file) {
        if (fs.statSync(path.join('public/' + srcpath, file)).isDirectory()) {
            totalSubFolders++;
            return true;
        }
        else {
            totalSubFiles++;
            return false;
        }
    });

    var p = {
        p: srcpath,
        f: totalSubFiles,
        s: totalSubFolders
    };
    results.push(p);

    for (var i in dirs) {
        results = getDirectories(srcpath + '/' + dirs[i], results);
    }
    return results;

}