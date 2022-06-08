var colorpicker = {

    _colors: [
        {
            name: "Red",
            variations: [
                {
                    weight: 50,
                    hex: "#FFEBEE"
                },
                {
                    weight: 100,
                    hex: "#FFCDD2"
                },
                {
                    weight: 200,
                    hex: "#EF9A9A"
                },
                {
                    weight: 300,
                    hex: "#E57373"
                },
                {
                    weight: 400,
                    hex: "#EF5350"
                },
                {
                    weight: 500,
                    hex: "#F44336"
                },
                {
                    weight: 600,
                    hex: "#E53935"
                },
                {
                    weight: 700,
                    hex: "#D32F2F"
                },
                {
                    weight: 800,
                    hex: "#C62828"
                },
                {
                    weight: 900,
                    hex: "#B71C1C"
                }
            ]
        },
        {
            name: "Pink",
            variations: [
                {
                    weight: 50,
                    hex: "#FCE4EC"
                },
                {
                    weight: 100,
                    hex: "#F8BBD0"
                },
                {
                    weight: 200,
                    hex: "#F48FB1"
                },
                {
                    weight: 300,
                    hex: "#F06292"
                },
                {
                    weight: 400,
                    hex: "#EC407A"
                },
                {
                    weight: 500,
                    hex: "#E91E63"
                },
                {
                    weight: 600,
                    hex: "#D81B60"
                },
                {
                    weight: 700,
                    hex: "#C2185B"
                },
                {
                    weight: 800,
                    hex: "#AD1457"
                },
                {
                    weight: 900,
                    hex: "#880E4F"
                }
            ]
        },
        {
            name: "Purple",
            variations: [
                {
                    weight: 50,
                    hex: "#F3E5F5"
                },
                {
                    weight: 100,
                    hex: "#E1BEE7"
                },
                {
                    weight: 200,
                    hex: "#CE93D8"
                },
                {
                    weight: 300,
                    hex: "#BA68C8"
                },
                {
                    weight: 400,
                    hex: "#AB47BC"
                },
                {
                    weight: 500,
                    hex: "#9C27B0"
                },
                {
                    weight: 600,
                    hex: "#8E24AA"
                },
                {
                    weight: 700,
                    hex: "#7B1FA2"
                },
                {
                    weight: 800,
                    hex: "#6A1B9A"
                },
                {
                    weight: 900,
                    hex: "#4A148C"
                }
            ]
        },
        {
            name: "Deep Purple",
            variations: [
                {
                    weight: 50,
                    hex: "#EDE7F6"
                },
                {
                    weight: 100,
                    hex: "#D1C4E9"
                },
                {
                    weight: 200,
                    hex: "#B39DDB"
                },
                {
                    weight: 300,
                    hex: "#9575CD"
                },
                {
                    weight: 400,
                    hex: "#7E57C2"
                },
                {
                    weight: 500,
                    hex: "#673AB7"
                },
                {
                    weight: 600,
                    hex: "#5E35B1"
                },
                {
                    weight: 700,
                    hex: "#512DA8"
                },
                {
                    weight: 800,
                    hex: "#4527A0"
                },
                {
                    weight: 900,
                    hex: "#311B92"
                }
            ]
        },
        {
            name: "Indigo",
            variations: [
                {
                    weight: 50,
                    hex: "#E8EAF6"
                },
                {
                    weight: 100,
                    hex: "#C5CAE9"
                },
                {
                    weight: 200,
                    hex: "#9FA8DA"
                },
                {
                    weight: 300,
                    hex: "#7986CB"
                },
                {
                    weight: 400,
                    hex: "#5C6BC0"
                },
                {
                    weight: 500,
                    hex: "#3F51B5"
                },
                {
                    weight: 600,
                    hex: "#3949AB"
                },
                {
                    weight: 700,
                    hex: "#303F9F"
                },
                {
                    weight: 800,
                    hex: "#283593"
                },
                {
                    weight: 900,
                    hex: "#1A237E"
                }
            ]
        },
        {
            name: "Blue",
            variations: [
                {
                    weight: 50,
                    hex: "#E3F2FD"
                },
                {
                    weight: 100,
                    hex: "#BBDEFB"
                },
                {
                    weight: 200,
                    hex: "#90CAF9"
                },
                {
                    weight: 300,
                    hex: "#64B5F6"
                },
                {
                    weight: 400,
                    hex: "#42A5F5"
                },
                {
                    weight: 500,
                    hex: "#2196F3"
                },
                {
                    weight: 600,
                    hex: "#1E88E5"
                },
                {
                    weight: 700,
                    hex: "#1976D2"
                },
                {
                    weight: 800,
                    hex: "#1565C0"
                },
                {
                    weight: 900,
                    hex: "#0D47A1"
                }
            ]
        },
        {
            name: "Light Blue",
            variations: [
                {
                    weight: 50,
                    hex: "#E1F5FE"
                },
                {
                    weight: 100,
                    hex: "#B3E5FC"
                },
                {
                    weight: 200,
                    hex: "#81D4FA"
                },
                {
                    weight: 300,
                    hex: "#4FC3F7"
                },
                {
                    weight: 400,
                    hex: "#29B6F6"
                },
                {
                    weight: 500,
                    hex: "#03A9F4"
                },
                {
                    weight: 600,
                    hex: "#039BE5"
                },
                {
                    weight: 700,
                    hex: "#0288D1"
                },
                {
                    weight: 800,
                    hex: "#0277BD"
                },
                {
                    weight: 900,
                    hex: "#01579B"
                }
            ]
        },
        {
            name: "Cyan",
            variations: [
                {
                    weight: 50,
                    hex: "#E0F7FA"
                },
                {
                    weight: 100,
                    hex: "#B2EBF2"
                },
                {
                    weight: 200,
                    hex: "#80DEEA"
                },
                {
                    weight: 300,
                    hex: "#4DD0E1"
                },
                {
                    weight: 400,
                    hex: "#26C6DA"
                },
                {
                    weight: 500,
                    hex: "#00BCD4"
                },
                {
                    weight: 600,
                    hex: "#00ACC1"
                },
                {
                    weight: 700,
                    hex: "#0097A7"
                },
                {
                    weight: 800,
                    hex: "#00838F"
                },
                {
                    weight: 900,
                    hex: "#006064"
                }
            ]
        },
        {
            name: "Teal",
            variations: [
                {
                    weight: 50,
                    hex: "#E0F2F1"
                },
                {
                    weight: 100,
                    hex: "#B2DFDB"
                },
                {
                    weight: 200,
                    hex: "#80CBC4"
                },
                {
                    weight: 300,
                    hex: "#4DB6AC"
                },
                {
                    weight: 400,
                    hex: "#26A69A"
                },
                {
                    weight: 500,
                    hex: "#009688"
                },
                {
                    weight: 600,
                    hex: "#00897B"
                },
                {
                    weight: 700,
                    hex: "#00796B"
                },
                {
                    weight: 800,
                    hex: "#00695C"
                },
                {
                    weight: 900,
                    hex: "#004D40"
                }
            ]
        },
        {
            name: "Green",
            variations: [
                {
                    weight: 50,
                    hex: "#E8F5E9"
                },
                {
                    weight: 100,
                    hex: "#C8E6C9"
                },
                {
                    weight: 200,
                    hex: "#A5D6A7"
                },
                {
                    weight: 300,
                    hex: "#81C784"
                },
                {
                    weight: 400,
                    hex: "#66BB6A"
                },
                {
                    weight: 500,
                    hex: "#4CAF50"
                },
                {
                    weight: 600,
                    hex: "#43A047"
                },
                {
                    weight: 700,
                    hex: "#388E3C"
                },
                {
                    weight: 800,
                    hex: "#2E7D32"
                },
                {
                    weight: 900,
                    hex: "#1B5E20"
                }
            ]
        },
        {
            name: "Light Green",
            variations: [
                {
                    weight: 50,
                    hex: "#F1F8E9"
                },
                {
                    weight: 100,
                    hex: "#DCEDC8"
                },
                {
                    weight: 200,
                    hex: "#C5E1A5"
                },
                {
                    weight: 300,
                    hex: "#AED581"
                },
                {
                    weight: 400,
                    hex: "#9CCC65"
                },
                {
                    weight: 500,
                    hex: "#8BC34A"
                },
                {
                    weight: 600,
                    hex: "#7CB342"
                },
                {
                    weight: 700,
                    hex: "#689F38"
                },
                {
                    weight: 800,
                    hex: "#558B2F"
                },
                {
                    weight: 900,
                    hex: "#33691E"
                }
            ]
        },
        {
            name: "Lime",
            variations: [
                {
                    weight: 50,
                    hex: "#F9FBE7"
                },
                {
                    weight: 100,
                    hex: "#F0F4C3"
                },
                {
                    weight: 200,
                    hex: "#E6EE9C"
                },
                {
                    weight: 300,
                    hex: "#DCE775"
                },
                {
                    weight: 400,
                    hex: "#D4E157"
                },
                {
                    weight: 500,
                    hex: "#CDDC39"
                },
                {
                    weight: 600,
                    hex: "#C0CA33"
                },
                {
                    weight: 700,
                    hex: "#AFB42B"
                },
                {
                    weight: 800,
                    hex: "#9E9D24"
                },
                {
                    weight: 900,
                    hex: "#827717"
                }
            ]
        },
        {
            name: "Yellow",
            variations: [
                {
                    weight: 50,
                    hex: "#FFFDE7"
                },
                {
                    weight: 100,
                    hex: "#FFF9C4"
                },
                {
                    weight: 200,
                    hex: "#FFF59D"
                },
                {
                    weight: 300,
                    hex: "#FFF176"
                },
                {
                    weight: 400,
                    hex: "#FFEE58"
                },
                {
                    weight: 500,
                    hex: "#FFEB3B"
                },
                {
                    weight: 600,
                    hex: "#FDD835"
                },
                {
                    weight: 700,
                    hex: "#FBC02D"
                },
                {
                    weight: 800,
                    hex: "#F9A825"
                },
                {
                    weight: 900,
                    hex: "#F57F17"
                }
            ]
        },
        {
            name: "Amber",
            variations: [
                {
                    weight: 50,
                    hex: "#FFF8E1"
                },
                {
                    weight: 100,
                    hex: "#FFECB3"
                },
                {
                    weight: 200,
                    hex: "#FFE082"
                },
                {
                    weight: 300,
                    hex: "#FFD54F"
                },
                {
                    weight: 400,
                    hex: "#FFCA28"
                },
                {
                    weight: 500,
                    hex: "#FFC107"
                },
                {
                    weight: 600,
                    hex: "#FFB300"
                },
                {
                    weight: 700,
                    hex: "#FFA000"
                },
                {
                    weight: 800,
                    hex: "#FF8F00"
                },
                {
                    weight: 900,
                    hex: "#FF6F00"
                }
            ]
        },
        {
            name: "Orange",
            variations: [
                {
                    weight: 50,
                    hex: "#FFF3E0"
                },
                {
                    weight: 100,
                    hex: "#FFE0B2"
                },
                {
                    weight: 200,
                    hex: "#FFCC80"
                },
                {
                    weight: 300,
                    hex: "#FFB74D"
                },
                {
                    weight: 400,
                    hex: "#FFA726"
                },
                {
                    weight: 500,
                    hex: "#FF9800"
                },
                {
                    weight: 600,
                    hex: "#FB8C00"
                },
                {
                    weight: 700,
                    hex: "#F57C00"
                },
                {
                    weight: 800,
                    hex: "#EF6C00"
                },
                {
                    weight: 900,
                    hex: "#E65100"
                }
            ]
        },
        {
            name: "Deep Orange",
            variations: [
                {
                    weight: 50,
                    hex: "#FBE9E7"
                },
                {
                    weight: 100,
                    hex: "#FFCCBC"
                },
                {
                    weight: 200,
                    hex: "#FFAB91"
                },
                {
                    weight: 300,
                    hex: "#FF8A65"
                },
                {
                    weight: 400,
                    hex: "#FF7043"
                },
                {
                    weight: 500,
                    hex: "#FF5722"
                },
                {
                    weight: 600,
                    hex: "#F4511E"
                },
                {
                    weight: 700,
                    hex: "#E64A19"
                },
                {
                    weight: 800,
                    hex: "#D84315"
                },
                {
                    weight: 900,
                    hex: "#BF360C"
                }
            ]
        },
        {
            name: "Brown",
            variations: [
                {
                    weight: 50,
                    hex: "#EFEBE9"
                },
                {
                    weight: 100,
                    hex: "#D7CCC8"
                },
                {
                    weight: 200,
                    hex: "#BCAAA4"
                },
                {
                    weight: 300,
                    hex: "#A1887F"
                },
                {
                    weight: 400,
                    hex: "#8D6E63"
                },
                {
                    weight: 500,
                    hex: "#795548"
                },
                {
                    weight: 600,
                    hex: "#6D4C41"
                },
                {
                    weight: 700,
                    hex: "#5D4037"
                },
                {
                    weight: 800,
                    hex: "#4E342E"
                },
                {
                    weight: 900,
                    hex: "#3E2723"
                }
            ]
        },
        {
            name: "Grey",
            variations: [
                {
                    weight: 50,
                    hex: "#FAFAFA"
                },
                {
                    weight: 100,
                    hex: "#F5F5F5"
                },
                {
                    weight: 200,
                    hex: "#EEEEEE"
                },
                {
                    weight: 300,
                    hex: "#E0E0E0"
                },
                {
                    weight: 400,
                    hex: "#BDBDBD"
                },
                {
                    weight: 500,
                    hex: "#9E9E9E"
                },
                {
                    weight: 600,
                    hex: "#757575"
                },
                {
                    weight: 700,
                    hex: "#616161"
                },
                {
                    weight: 800,
                    hex: "#424242"
                },
                {
                    weight: 900,
                    hex: "#212121"
                }
            ]
        },
        {
            name: "Blue Grey",
            variations: [
                {
                    weight: 50,
                    hex: "#ECEFF1"
                },
                {
                    weight: 100,
                    hex: "#CFD8DC"
                },
                {
                    weight: 200,
                    hex: "#B0BEC5"
                },
                {
                    weight: 300,
                    hex: "#90A4AE"
                },
                {
                    weight: 400,
                    hex: "#78909C"
                },
                {
                    weight: 500,
                    hex: "#607D8B"
                },
                {
                    weight: 600,
                    hex: "#546E7A"
                },
                {
                    weight: 700,
                    hex: "#455A64"
                },
                {
                    weight: 800,
                    hex: "#37474F"
                },
                {
                    weight: 900,
                    hex: "#263238"
                }
            ]
        }
    ],

    popup: function(target, callback) {
        let body = target.ownerDocument.body
        let middle = target.offsetLeft + target.clientWidth / 2
        let x = middle - 220 / 2
        let y = target.offsetTop + target.clientHeight + 5
        let right = x + 220
        if (right > body.clientWidth) {
            x = body.clientWidth - 220
        }
        if (x < 0) {
            x = 2
        }

        let colorpicker = document.getElementById('colorpicker')
        if (document.getElementById('colorpicker')) {
            colorpicker.hidden = false
            let container = colorpicker.querySelector('.container')
            container.style.left = `${x}px`
            container.style.top = `${y}px`

            colorpicker.querySelectorAll('.color-btn').forEach(e => {
                e.onclick = (event) => {
                    let clr = event.target.getAttribute('color')
                    callback(clr)
                    colorpicker.hidden = true
                }
            })
            return
        }

        colorpicker = document.createElement('div')
        colorpicker.setAttribute('id', 'colorpicker')
        colorpicker.style.position = 'absolute'
        colorpicker.onclick = () => {
            colorpicker.hidden = true
        }
        colorpicker.style.left = 0
        colorpicker.style.top = 0
        colorpicker.style.width = '100%'
        colorpicker.style.height = '100%'
        colorpicker.tabIndex = 999
        body.append(colorpicker)

        let container = document.createElement('div')
        container.setAttribute('class', 'container')
        container.style.position = 'absolute'
        container.style.left = `${x}px`
        container.style.top = `${y}px`
        colorpicker.append(container)
        this._colors.forEach(clr => {
            let div = document.createElement('div')
            div.style.display = 'flex'
            clr.variations.forEach(e => {
                let div1 = document.createElement('div')
                div1.setAttribute('class', 'color-btn')
                div1.style.height = '20px'
                div1.style.width = '20px'
                div1.style.border = '1px solid rgba(255, 255, 255, 0)'
                div1.setAttribute('color', e.hex)
                div1.onclick = (event) => {
                    let clr = event.target.getAttribute('color')
                    callback(clr)
                    colorpicker.hidden = true
                }
                div1.style.backgroundColor = e.hex
                div.append(div1)
            })
            container.append(div)
        })
    }
}


if (typeof window !== 'undefined') {
    window.colorpicker = colorpicker
}