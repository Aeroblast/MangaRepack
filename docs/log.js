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