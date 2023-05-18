export function getId(URL) {
    return URL.split("/")[5] || null
}

export function dateFormatter(string) {
    return new Date(string).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export function agreg(tab) {
    let res = {}
    tab.forEach((elem) => {
        if (res[elem]) {
            res[elem]++
        } else {
            res[elem] = 1
        }
    });
    //console.log(res)
    return res
}