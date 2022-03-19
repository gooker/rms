import React, { memo, useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import * as zrender from 'zrender';
import jsPDF from 'jspdf';
import { groupBy, sortBy } from 'lodash';
import { getCurrentLogicAreaData, getCurrentRouteMapData } from '@/utils/mapUtil';
import { formatMessage, convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { JspdfData } from '@/config/consts';
import { getAllallCellsMap, exportCells, styleDistance } from './constructionUtil';

const cellWidth = 12;
const cellHeight = 12;
const scaNum = 0.06;
const standardColor = '#787f86';
const blockColor = '#fff';
const cellColor = '#1373a3';
let basenum = 410;
let thisZrender;

const ConstructionDrawing = (props) => {
  const {
    Info: {
      exportType,
      papersize,
      paperoriente,
      showBlockedCellsFlag,
      showCoordinates,
      degree,
      direction,
      remark,
      exportCellDataFlag,
    },
    currentLogicArea,
    currentRouteMapData,
    username,
    currentMap: { cellMap, elevatorList, name: currentMapName },
  } = props;
  const [loading, setLoading] = useState(false);
  const [defaultWidth, setDefaultWidth] = useState(JspdfData['A3'][0]);
  const [defaultHeight, setDefaultHeight] = useState(JspdfData['A3'][1]);
  const [orientation, setOrientation] = useState('p');

  useEffect(() => {
    if (papersize && paperoriente) {
      if (paperoriente === 'p') {
        setDefaultWidth(JspdfData[papersize][0]);
        setDefaultHeight(JspdfData[papersize][1]);
      } else {
        setDefaultWidth(JspdfData[papersize][1]);
        setDefaultHeight(JspdfData[papersize][0]);
      }
      setOrientation(paperoriente);
    }
    //
    const { currentCellMap, elementNum, elevatorId } = getAllallCellsMap(
      showBlockedCellsFlag,
      cellMap,
      elevatorList,
      currentRouteMapData,
      currentLogicArea,
    );

    if (elementNum.length >= 3200) {
      basenum = 520;
    }
    let baseWidth = elementNum.length / basenum;
    if (baseWidth < 1) {
      baseWidth = 1;
    }

    const currentWidth = elementNum.elementsWidth * scaNum + baseWidth * 130;
    const currentHeight = elementNum.elementsHeight * scaNum + +baseWidth * 130;
    thisZrender = zrender.init(document.getElementById('constructionDrewCanvas'), {
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio,
      width: currentWidth < 1050 ? '1050px' : `${currentWidth + 70}px`,
      height: `${currentHeight + 70}px`,
    });

    drawShape(currentCellMap, elementNum, elevatorId);

    return () => {
      thisZrender.dispose();
      thisZrender = null;
    };
  }, []);

  function drawShape(cells, elementNum, elevatorIds) {
    // 1.需要用到的数据
    const minX = elementNum.minX * scaNum; // 最小点位的x
    const minY = elementNum.minY * scaNum; // 最小点位的y
    const blockCellIds = currentRouteMapData?.blockCellIds || []; // 不可走点

    // 2.展示点位id x y轴坐标 存储点
    const currentCellMap = { ...cells };
    Object.keys(currentCellMap).forEach((item) => {
      const currentId = currentCellMap[item];
      if (elevatorIds.includes(Number(item))) return;

      // 显示x y--这个看配置
      if (showCoordinates) {
        drawCoordinates(currentId, minX, minY);
      }

      const currentColor = blockCellIds.includes(currentId.id) ? blockColor : standardColor;
      const cellText = new zrender.Rect({
        shape: {
          x: currentId.x * scaNum + 90 - minX,
          y: currentId.y * scaNum + 146 - minY,
          width: cellWidth,
          height: cellHeight,
        },
        style: {
          fill: currentColor,
          stroke: '#000',
          text: currentId.id,
          textPosition: 'bottom',
          textFill: cellColor,
          textOffset: [0, 0],
          fontWeight: 700,
          fontSize: 20,
        },
      });

      thisZrender.add(cellText);
    });

    // 画距离line
    drawDistanceline(currentCellMap, minX, minY);
    // 画图例说明
    drawLegend(currentCellMap);
  }

  function drawCoordinates(cellOB, minX, minY) {
    const coordinateMap = [
      {
        x: cellOB.x * scaNum + 90 - minX - 23,
        y: cellOB.y * scaNum + 146 - minY - 15,
        text: cellOB.x,
        textOffset: [3, 0],
      },
      {
        x: cellOB.x * scaNum + 90 - minX + 23,
        y: cellOB.y * scaNum + 146 - minY - 15,
        text: cellOB.y,
        textOffset: [-3, 0],
      },
    ];
    coordinateMap.map(({ x, y, text, textOffset }) => {
      thisZrender.add(
        new zrender.Rect({
          shape: {
            x,
            y,
            width: cellWidth,
            height: cellHeight,
          },
          style: {
            fill: 'transparent', // 填充颜色，默认#000 817775
            lineWidth: 1, // 线宽， 默认1
            text,
            textFill: cellColor,
            textOffset,
          },
        }),
      );
    });
  }
  function drawDistanceline(cells, minX, minY) {
    const cellsArray = Object.values(cells);
    const groupX = groupBy(cellsArray, 'x'); // x轴相等---竖着线
    const groupY = groupBy(cellsArray, 'y'); // y轴相等---横着线

    Object.keys(groupX).forEach((xitem) => {
      let currentItem = groupX[xitem];
      if (currentItem.length >= 2) {
        currentItem = sortBy(currentItem, 'y');
        currentItem.forEach((currentId, xindex) => {
          const nextCurrentId = currentItem[xindex + 1];
          if (nextCurrentId && Object.keys(nextCurrentId).length >= 1) {
            const yLine = new zrender.Line({
              shape: {
                x1: currentId.x * scaNum - minX + 96,
                y1: currentId.y * scaNum - minY + 183,
                x2: nextCurrentId.x * scaNum - minX + 96,
                y2: nextCurrentId.y * scaNum - minY + 146,
              },
              style: {
                text: nextCurrentId.y - currentId.y,
                textOffset: [15, -5],
                ...styleDistance,
              },
            });
            thisZrender.add(yLine);
          }
        });
      }
    });

    Object.keys(groupY).forEach((xitem) => {
      let currentItemY = groupY[xitem];
      if (currentItemY.length >= 2) {
        currentItemY = sortBy(currentItemY, 'x');
        currentItemY.forEach((currentId, xindex) => {
          const nextCurrentId = currentItemY[xindex + 1];
          if (nextCurrentId && Object.keys(nextCurrentId).length >= 1) {
            const yLine = new zrender.Line({
              shape: {
                x1: currentId.x * scaNum - minX + 102,
                y1: currentId.y * scaNum - minY + 152,
                x2: nextCurrentId.x * scaNum - minX + 90,
                y2: nextCurrentId.y * scaNum - minY + 152,
              },
              style: {
                text: nextCurrentId.x - currentId.x,
                ...styleDistance,
              },
            });
            thisZrender.add(yLine);
          }
        });
      }
    });
  }
  function drawLegend(cells, minX, minY) {
    // 直接用line 填充色变不成白色--所有方向都用polyline
    const directionLine = new zrender.Polyline({
      shape: {
        points: [
          [65, 50],
          [65, 90],
          [55, 90],
          [55, 50],
        ],
      },
      style: {
        fill: '#fff',
        stroke: '#000',
      },
    });

    const arrowLeft = new zrender.Polyline({
      shape: {
        points: [
          [60, 35],
          [45, 50],
          [55, 50],
        ],
      },
      style: {
        fill: '#fff',
        stroke: '#000',
        text: `${direction}  ${degree ? degree : '0'}° `,
        textPosition: 'top',
      },
    });
    const arrowRight = new zrender.Polyline({
      shape: {
        points: [
          [60, 35],
          [75, 50],
          [65, 50],
        ],
      },
      style: {
        fill: '#fff', // 填充颜色，默认#000
        stroke: '#000', // 描边颜色，默认null
      },
    });

    thisZrender.add(directionLine);
    thisZrender.add(arrowLeft);
    thisZrender.add(arrowRight);

    // 图例说明
    const legendInfo = [
      {
        x: 130,
        y: 30,
        fill: standardColor,
        text: formatMessage({ id: 'editor.constructionDrawing.standardCell' }),
      },
      { x: 130, y: 70, fill: blockColor, text: formatMessage({ id: 'editor.cellType.forbid' }) },
    ];
    legendInfo.map(({ x, y, fill, text }) => {
      thisZrender.add(
        new zrender.Rect({
          shape: {
            x,
            y,
            width: 22,
            height: 22, //
          },
          style: {
            fill, // 填充颜色，默认#000 817775
            stroke: '#000', // 描边颜色，默认null
            lineWidth: 1, // 线宽， 默认1
            text,
            textPosition: 'right',
            textFill: '#123476',
            fontSize: 13,
          },
        }),
      );
    });

    const name =
      currentMapName.length > 13
        ? `${currentMapName.substring(0, 13)} \n ${currentMapName.substring(13)}`
        : currentMapName;

    const configureDisplay = [
      {
        x: 270,
        y: 10,
        text: `${formatMessage({ id: 'editor.constructionDrawing.mapName' })}:   ${name}`,
      },
      {
        x: 270 + 260 * 1,
        y: 10,
        text: `${formatMessage({ id: 'app.taskRecord.date' })}:   ${convertToUserTimezone(new Date()).format(
          'YYYYMMDD',
        )}`,
      },
      {
        x: 270 + 260 * 2,
        y: 10,
        text: `${formatMessage({ id: 'editor.constructionDrawing.unit' })}:   mm`,
      },
      {
        x: 270,
        y: 50,
        text: `${formatMessage({ id: 'editor.constructionDrawing.createUser' })}: ${username} `,
      },
      {
        x: 270 + 260 * 1,
        y: 50,
        text: `${formatMessage({ id: 'editor.constructionDrawing.cellNumber' })}: ${
          Object.keys(cells).length
        }`,
      },
      {
        x: 270 + 260 * 2,
        y: 50,
        text: `${formatMessage({ id: 'app.common.remark' })}:  ${remark || '-'}`,
      },
    ];

    configureDisplay.map(({ x, y, text }) => {
      thisZrender.add(
        new zrender.Rect({
          shape: {
            x,
            y,
            width: 260,
            height: 40,
          },
          style: {
            fill: '#fff', // 填充颜色，默认#000
            stroke: '#000', // 描边颜色，默认null
            lineWidth: 1, // 线宽， 默认1
            text,
            fontSize: 14,
          },
        }),
      );
    });
  }

  function exportPNG() {
    const canvas = document.querySelector('#constructionDrewCanvas canvas');
    if (canvas) {
      const strDataURI = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.download = `${currentMapName}-${currentLogicArea.name || null}  -${formatMessage({
        id: 'app.constructiondrawing',
      })}${convertToUserTimezone(new Date()).format('YYYYMMDD')}.png`; // 下载的文件名，
      a.href = strDataURI;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setLoading(false);
  }

  function exportPDF() {
    const canvas = document.querySelector('#constructionDrewCanvas canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = canvas.toDataURL('image/png', 1.0);
    const hLength = Math.ceil(canvas.height / defaultHeight); //h分页页数
    const xLength = Math.ceil(canvas.width / defaultWidth); //w分页页数
    const imgArr = []; //用来存储图片的数组
    const pagesArr = []; //用来存储图片分页
    const alternateCanvas = document.getElementById('alternateConstructionCanvas'); //获取备用画布
    const alternateCtx = alternateCanvas.getContext('2d');
    const imgX = defaultWidth;
    const imgY = defaultHeight;
    // 切分图片
    img.onload = function () {
      for (let i = 0; i < xLength; i++) {
        for (var j = 0; j < hLength; j++) {
          var imgData = ctx.getImageData(i * imgX, j * imgY, imgX, imgY);
          alternateCtx.putImageData(imgData, 0, 0);
          imgArr.push(alternateCanvas.toDataURL('image/png', 1.0));
          pagesArr.push(`${j + 1}-${i + 1}`);
        }
      }
      // 最后导出
      exportPDFwidthPages(imgArr, pagesArr);
    };
  }
  function exportPDFwidthPages(imgs, pages) {
    const pdfName = `${currentMapName}-${currentLogicArea.name || null} -${
      papersize || null
    } -${formatMessage({
      id: 'app.constructiondrawing',
    })}${convertToUserTimezone(new Date()).format('YYYYMMDD')}.pdf`;

    const pdf = new jsPDF(orientation, 'pt', papersize);
    const imgLength = imgs.length;
    for (var i = 0; i < imgLength; i++) {
      //根据切好的图片数组进行分页
      pdf.addImage(imgs[i], 'png', 0, 20, defaultWidth, defaultHeight - 20); // img, PNG/JPG, x（左侧偏移）, y(上侧便宜), w, h,
      // 页码
      pdf.setTextColor(44, 58, 4); //90, 105, 11
      pdf.text(10, 20, `${pages[i]}`);

      if (i < imgLength - 1) {
        //避免添加空白页
        pdf.addPage();
      }
    }
    pdf.save(pdfName);
    setLoading(false);
  }

  function cellExport() {
    exportCells(currentRouteMapData, currentLogicArea, cellMap);
  }
  return (
    <div>
      <Spin spinning={loading}>
        {exportCellDataFlag && (
          <Button onClick={cellExport} size={'small'}>
            <FormattedMessage id="editor.constructionDrawing.cellExport" />
          </Button>
        )}{' '}
        {exportType === 'PNG' ? (
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              exportPNG();
            }}
            size={'small'}
          >
            <FormattedMessage id="editor.constructionDrawing.pngExport" />
          </Button>
        ) : (
          <>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                exportPDF();
              }}
              size={'small'}
            >
              <FormattedMessage id="editor.constructionDrawing.pdfExport" />
            </Button>

            <canvas
              id="alternateConstructionCanvas"
              width={defaultWidth}
              height={defaultHeight}
              style={{ display: 'none', border: 'none' }}
            />
          </>
        )}
      </Spin>

      <div id="constructionDrewCanvas"></div>
    </div>
  );
};
export default connect(({ editor, user }) => ({
  currentMap: editor.currentMap,
  currentLogicArea: getCurrentLogicAreaData() || {},
  currentRouteMapData: getCurrentRouteMapData(),
  username: user.currentUser?.username,
}))(memo(ConstructionDrawing));
