'use strict'
/**
 * Created by thanhnv on 2/2/15.
 */
let fs = require('fs'),
    sizeOf = require('image-size'),
    im = require('imagemagick'),
    formidable = require('formidable'),
    path = require('path');
let rootPath = '/fileman/Uploads';
let standardPath = __base + 'public/';

exports.dirtree = function (req, res) {
    let results = [];
    getDirectories(rootPath, results);
    res.jsonp(results);
};

exports.createdir = function (req, res) {
    let dir = req.param('d');
    let name = req.param('n');
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
    let dir = req.param('d');

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
    let d = req.param('d');
    let n = req.param('n');
    let path = d.substring(0, d.lastIndexOf('/'));

    fs.renameSync(standardPath + d, standardPath + path + '/' + n);
    res.jsonp({"res": "ok", "msg": ""});
};

exports.fileslist = function (req, res) {
    let folder = req.param('d');
    let type = req.param('type');
    let rPath = standardPath + folder;
    fs.readdir(rPath, function (err, files) {
        if (err) {
        }
        else {
            let result = [];
            for (let i in files) {
                let filePath = rPath + '/' + files[i];
                if (checkFileType(filePath) == "image") {
                    let sta = fs.statSync(filePath);
                    if (sta.isFile()) {

                        let dimension = sizeOf(filePath);
                        let p = {
                            p: folder + "/" + files[i],
                            s: sta.size,
                            t: new Date(sta.mtime).getTime() / 1000,
                            w: dimension.width,
                            h: dimension.height
                        };
                        result.push(p);
                    }
                }
            }
            res.jsonp(result);
        }
    });
};

exports.upload = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let folder = fields.d;
        let folder_to_upload = standardPath + folder;
        fs.rename(files["files[]"].path, folder_to_upload + '/' + files["files[]"].name, function (err) {
            if (err) {
                //console.log(err);
            }
        });
    });
    form.on('end', function () {
        res.jsonp({"res": "ok", "msg": ""});
    });
};

exports.download = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};

exports.downloaddir = function (req, res) {
    res.jsonp({"res": "error", "msg": "Chưa tích hợp"});
};

exports.deletefile = function (req, res) {
    let file = req.param('f');
    if (fs.existsSync(standardPath + file)) {
        fs.unlink(standardPath + file, function (err) {
            if (err) {
                throw err;
            }
            else {
                let tmp = getFileName(file);
                let tmp_path = standardPath + '/fileman/tmp/' + tmp;
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
    let f = req.param('f');
    let n = req.param('n');
    let path = f.substring(0, f.lastIndexOf('/'));
    fs.renameSync(standardPath + f, standardPath + path + '/' + n);

    // Change name of thumb tmp
    let tmp = getFileName(f);
    let tmp_path = standardPath + '/fileman/tmp/' + tmp;
    if (fs.existsSync(tmp_path)) {
        fs.renameSync(tmp_path, standardPath + '/fileman/tmp/' + n);
    }
    res.jsonp({"res": "ok", "msg": ""});
};

exports.thumb = function (req, res) {
    let filePath = req.param('f');
    let width = req.param('width');
    let height = req.param('height');
    let tmpFolder = standardPath + '/fileman/tmp';
    let filename = getFileName(filePath);

    // Check file exit
    if (fs.existsSync(tmpFolder + '/' + filename)) {
        let img = fs.readFileSync(tmpFolder + '/' + filename);
        res.writeHead(200, {'Content-Type': 'image/' + getExtension(filename) });
        res.end(img, 'binary');
    } else {
        // Create thumbnail
        im.resize({
            srcPath: standardPath + filePath,
            dstPath: tmpFolder + '/' + filename,
            width: width,
            height: height
        }, function (err, stdout, stderr) {
            if (err) throw err;
            let img = fs.readFileSync(tmpFolder + '/' + filename);
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
    let files_and_dirs = fs.readdirSync(standardPath + srcpath);
    let totalSubFolders = 0;
    let totalSubFiles = 0;
    let dirs = files_and_dirs.filter(function (file) {
        if (fs.statSync(path.join('public/' + srcpath, file)).isDirectory()) {
            totalSubFolders++;
            return true;
        }
        else {
            totalSubFiles++;
            return false;
        }
    });

    let p = {
        p: srcpath,
        f: totalSubFiles,
        s: totalSubFolders
    };
    results.push(p);

    for (let i in dirs) {
        results = getDirectories(srcpath + '/' + dirs[i], results);
    }
    return results;
}