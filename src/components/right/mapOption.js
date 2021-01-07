export function transtomap(data, step) {
    let xList = data.map(v => v[0]);
    let yList = data.map(v => v[1]);

    let maxX = Math.max(...xList);
    let minX = Math.min(...xList);
    let maxY = Math.max(...yList);
    let minY = Math.min(...yList);

    let xstep = (maxX - minX) / step;
    let ystep = (maxY - minY) / step;
    let newDatax = [];
    let newDatay = [];
    for (let i = 0; i < step + 1; i++) {
        if (maxX == data[0][0]) {
            newDatax.push(data[0][0] - xstep * i)
        } else {
            newDatax.push(data[0][0] + xstep * i)
        }
        if (maxY == data[0][1]) {
            newDatay.push(data[0][1] - ystep * i)
        } else {
            newDatay.push(data[0][1] + ystep * i)
        }
    }
    let newData = newDatax.map((v, index) => {
        return [v, newDatay[index]]
    })
    return [newData, step]
}
export function transtodata(data, symbolRotate, alert) {
    let links1 = [], links2 = [];
    let length = data[0].length;
    data[0].map((v, index) => {
        // return {
        //     coords: [
        //        v,
        //       data[index+1],

        //     ],
        //     lineStyle: { color: "green" },
        //     label: {
        //       show: true,
        //     },
        //   }
        if (index < length - 1) {
            links1.push({
                coords: [
                    [v[0] - 1.5, v[1]],
                    [data[0][index + 1][0] - 1.5, data[0][index + 1][1]],

                ],
                //alert[0] == 0 ? "green" : 'red'可以根据传值动态更换波浪线颜色
                lineStyle: { color: 'green', curveness: data[0][0][1] > data[0][length - 1][1] && index % 2 == 0 ? -0.2 : 0.2, },
                label: {
                    show: true,
                },
            })
            links2.push({
                coords: [
                    [v[0] + 1.5, v[1]],
                    [data[0][index + 1][0] + 1.5, data[0][index + 1][1]],

                ],
                // alert[1] == 0 ? "green" : 'red'
                lineStyle: { color:'green', curveness: data[0][0][1] > data[0][length - 1][1] && index % 2 == 0 ? 0.2 : -0.2, },
                label: {
                    show: true,
                },
            })
        }

    })
    let option= [
        {
            type: "lines",
            zlevel: 2,
            effect: {
                show: true,
                period: 3, //箭头指向速度，值越小速度越快
                trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
                symbol: "none", //箭头图标
                symbolSize: 7, //图标大小

            },
            lineStyle: {
                normal: {
                    color: "#1DE9B6",
                    width: 1, //线条宽度
                    opacity: 0.2, //尾迹线条透明度
                },
            },
            data: [...links1, ...links2],
        }
    ]
    for(let i=0;i<data[1];i++){
        option.push(
            {
                type: 'lines',
                zlevel: 1.5,
                effect: {
                    show: true,
                    period: data[1],
                    delay:i*1000,
                    trailLength: 0,
                    color: '#fff',
                    symbol:alert[2]===0? "image:///greentran3.png":'image:///redtran3.png',
                    // symbol:alert[2]===0? "circle":'rect',
                    symbolSize: 20,
                    symbolRotate: symbolRotate,
                },
                lineStyle: {
                    normal: {
                        // color: color[i],
                        width: 0,
                        show:false,
                        curveness: 0
                    }
                },
                // symbol: "image:///greentran.png",
                // focusNodeAdjacency: false,
                // symbolSize: 20,
                // symbolRotate: symbolRotate,
                // roam: false,
                // animation: false,
                data:[{
                    coords: [data[0][0], data[0][length-1]]
                }]
            })
    }
    return option
}

