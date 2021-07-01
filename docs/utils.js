String.prototype.replaceAll = function (s1, s2) { return this.replace(new RegExp(s1, "gm"), s2); }

String.prototype.Path_GetFilename = function () {
    const i = this.lastIndexOf('/');
    if (i < 0) return this;
    if (i == this.length - 1) return this.substring(0, this.length - 1).Path_GetFilename();
    else return this.substring(i + 1);
}
String.prototype.Path_GetExtension = function () {
    const i = this.lastIndexOf('.');
    if (i < 0) return "";
    const t = this.substring(i);
    if (t.indexOf('/') >= 0) return "";
    else return t;
}
String.prototype.Path_GetFilenameWithoutExtension = function () {
    const filename = this.Path_GetFilename();
    const i = filename.indexOf('.');
    if (i < 0) return filename;
    return filename.substring(0, i);
}
String.prototype.Path_GetDirectory = function () {
    const i = this.lastIndexOf('/');
    if (i < 0) return "";
    if (i == this.length - 1) return this.substring(0, this.length - 1).Path_GetDirectory();
    else return this.substring(0, i + 1);
}
String.prototype.Path_GetMediaType = function () {

    return GetMediaTypeFromExtension(this.Path_GetExtension());
}
function GetMediaTypeFromExtension(ext) {
    switch (ext) {
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
    }
}
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
function StringCommonStart(str1, str2) {
    //keep str1 shorter when use, as accelation
    if (str2.indexOf(str1) == 0) return str1;
    let i = 0;
    let r = "";
    for (; i < str1.length && i < str2.length; i++) {
        if (str1[i] == str2[i]) r += str1[i];
        else break;
    }
    return r;
}

function shortenStringFromEnd(str, l = 8) {
    if (str.length <= l) return str;
    else return "…" + str.substring(str.length - l)
}

function getValidFilename(str) {
    return str
        .replaceAll("/", "／")
        .replaceAll("\\\\", "＼")
        .replaceAll("<", "＜")
        .replaceAll(">", "＞")
        .replaceAll("\\?", "？")
        .replaceAll(":", "：")
        .replaceAll("\\|", "｜")
        .replaceAll("\\*", "＊");
}