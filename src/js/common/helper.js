export function loadScript(src, parentNode = document.body, isCheckRepeat = true, replace = false) {
    return new Promise((resolve, reject) => {
        if (isCheckRepeat) {
            let targetScript = [...document.scripts].find(item => {
                return src === item.src;
            });
            if (targetScript) {
                if (replace) {
                    targetScript.parentNode.removeChild(targetScript);
                } else {
                    // 返回一个2代表script标签已经加载过
                    return resolve(2);
                }
            }
        }
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        parentNode.appendChild(script);
        // 同时用onload和onreadystatechange，是为了解决低版本ie不支持onload，低版本firefox不支持onreadystatechange
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                // 返回一个1代表script标签加载成功
                resolve(1);
            }
        };
        script.onerror = (event) => {
            reject(event);
        };
    });
}

export function loadLink(cssUrl) {
    // document.querySelectorAll('link') // check repeat
    const head = document.querySelector('head');
    const linkTag = document.createElement('link');
    linkTag.href = cssUrl;
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    head.appendChild(linkTag);
}
