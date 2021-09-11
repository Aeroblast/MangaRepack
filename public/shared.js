var globleCounter = 0;
const pageRatio = 1.414;
var vm;
function GenarateId() { globleCounter++; return globleCounter; }

async function CreateSource(blob, name, from) {
    let obj = new Object();
    //obj.image = await createImageBitmap(blob);//May face memory problem
    obj.getImage = async function () { return await createImageBitmap(blob) }
    obj.filename = name;
    obj.blob = blob;
    let image = await obj.getImage();
    obj.width = image.width;
    obj.height = image.height;
    obj.thumbURL = await CreateThumbURL(image);
    obj.from = from; //archive file placeholder
    return obj;
}
var placeholderImage, placeholderThumbURL;
(async () => {
    //let s = new OffscreenCanvas(80, 80 * ratio);
    let s = document.createElement("canvas")
    s.width = 80;
    s.height = 80 * pageRatio;
    let c = s.getContext("2d");
    c.font = "10px Arial";
    c.fillText("Placeholder", 3, 40);
    let b;
    //b = await s.convertToBlob();//OffScreen
    b = await new Promise(resolve => s.toBlob(resolve));
    placeholderThumbURL = URL.createObjectURL(b);
    placeholderImage = s;
})();
function CreateSourcePlaceholder(after_source) {
    let obj = new Object();
    obj.image = placeholderImage;
    obj.getImage = function () { return obj.image }
    obj.filename =
        after_source.filename.Path_GetDirectory() +
        "" +
        after_source.filename.Path_GetFilenameWithoutExtension() +
        "_blank";
    obj.blob = null;
    obj.thumbURL = placeholderThumbURL;
    obj.from = "placeholder";
    obj.width = obj.image.width;
    obj.height = obj.image.height;
    return obj;
}
async function CreateThumbURL(image) {
    const ow = 140, oh = ow * pageRatio;
    //let s = new OffscreenCanvas(ow, oh);
    let s = document.createElement("canvas")
    s.width = ow;
    s.height = oh;
    let fit = FitImage(image, ow, oh);
    let c = s.getContext('2d');
    c.drawImage(image, fit[0], fit[1], fit[2], fit[3]);
    let b;
    // b= await s.convertToBlob();//OffScreen canvas
    b = await new Promise(resolve => s.toBlob(resolve));
    return URL.createObjectURL(b);
}

function FitImage(image, w, h) {
    let fw = w, fh = h;
    let x = 0, y = 0;
    if (image.width / image.height > w / h) {
        fh = w * image.height / image.width;
        y = (h - fh) / 2;
    }
    else {
        fw = h * image.width / image.height;
        x = (w - fw) / 2;
    }
    return [x, y, fw, fh];
}

function sortSourceByFullPath(s1, s2) {
    let name1 = s1.filename, name2 = s2.filename;
    if (name1 < name2) {
        return -1;
    }
    if (name1 > name2) {
        return 1;
    }
    return 0;
}
function sortSourceByFilename(s1, s2) {
    let name1 = s1.filename, name2 = s2.filename;
    if (name1 < name2) {
        return -1;
    }
    if (name1 > name2) {
        return 1;
    }
    return 0;
}



/**
 * 
 * @param {*} message 
 * @param {*} type
 * @param {String} bsClass  value: primary secondary success danger warning info 
 */
function log(content, bsClass = "info", type = "LogMessage") {
    logValueChangeEnd();
    let id = GenarateId();
    vm.log.push({ content: content, type: type, bsClass: bsClass, time: new Date().toLocaleTimeString(), id: id });
    console.log(content)
    let e = document.querySelector("#log");
    setTimeout(() => { e.scrollTo(0, e.scrollHeight); }, 100);
    return id;
}
var editingSource = null;
var editingLogId = null;
var editingMsg = null;
function logValueChange(msg, src, oldValue, newValue) {
    if (!oldValue) oldValue = "(empty)";
    if ((editingSource == null && src != null) || editingMsg != msg || (src && src.filename != editingSource.filename)) {
        editingLogId = log(
            msg
            + (src ? (shortenStringFromEnd(src.filename) + ": " + oldValue + "=>") : "")
            , "primary", "LogMessageVar");
        editingSource = src;
        editingMsg = msg;
    }
    vm.logVar = newValue;
}
function logValueChangeEnd() {
    if (!editingLogId) return;
    let i = 0;
    for (const msg of vm.log) {
        if (msg.id == editingLogId) {
            vm.log[i] = { content: msg.content + " " + vm.logVar, type: "LogMessage", bsClass: msg.bsClass, time: msg.time, id: msg.id };
            break;
        }
        i++;
    }
    editingSource = null;
    editingLogId = null;
}
function ToggleLog() {
    let e = document.querySelector("#log");
    if (e.getAttribute("data-enlarge")) {
        e.removeAttribute("data-enlarge")
    } else {
        e.setAttribute("data-enlarge", "true")
    }
    setTimeout(() => { e.scrollTo(0, e.scrollHeight); }, 100);
}