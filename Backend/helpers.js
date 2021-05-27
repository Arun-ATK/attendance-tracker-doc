const csvFilter = function(req, file, cb) {
    // Accept csv only
    if (!file.originalname.match(/\.(csv)$/)) {
        req.fileValidationError = 'Only csv files are allowed!';
        return cb(new Error('Only csv files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = csvFilter;
