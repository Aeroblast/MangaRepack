function GetChildRectX(args, i, rectW = 0) {
    switch (args.writingMode) {
        case "horizontal-tb":
            return args.x;
        case "vertical-rl":
            if (!rectW) {
                rectW = GetChildRectW(args);
            }
            return args.x + args.width - (rectW * (i + 1) + args.gap * i);
    }
}
function GetChildRectY(args, i, rectH = 0) {
    switch (args.writingMode) {
        case "horizontal-tb":
            if (!rectH) {
                rectH = GetChildRectH(args);
            }
            return args.y + (rectH * i + args.gap * i);
        case "vertical-rl":
            return args.y;
    }
}
function GetChildRectW(args) {
    switch (args.writingMode) {
        case "horizontal-tb":
            return args.width;
        case "vertical-rl":
            return (args.width - args.gap * (args.targetArray.length - 1)) / args.targetArray.length;
    }
}
function GetChildRectH(args) {

    switch (args.writingMode) {
        case "horizontal-tb":
            return (args.height - args.gap * (args.targetArray.length - 1)) / args.targetArray.length;
        case "vertical-rl":
            return args.height;
    }

}

export { GetChildRectX, GetChildRectY, GetChildRectW, GetChildRectH };