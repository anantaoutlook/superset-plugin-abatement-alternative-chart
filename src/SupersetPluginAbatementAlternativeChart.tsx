/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from "react";
import { styled } from "@superset-ui/core";
import {
  SupersetPluginAbatementAlternativeChartProps,
  SupersetPluginAbatementAlternativeChartStylesProps,
} from "./types";
import * as d3 from "d3";

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginAbatementAlternativeChartStylesProps>``;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginAbatementAlternativeChart(
  props: SupersetPluginAbatementAlternativeChartProps
) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;
  console.log("data", data);
  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    while (root.hasChildNodes()) {
      root.replaceChildren();
    }
    render();
  });

  const render = function () {
    // bar colors
    const fontSize = 10;
    const colorArray = [
      "#FDA339",
      "#94A559",
      "#9E9E9E",
      "#C2CEDC",
      "#3A9A38",
      "#FF6633",
      "#FFB399",
      "#FF33FF",
      "#FFFF99",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#99FF99",
      "#B34D4D",
      "#80B300",
      "#809900",
      "#E6B3B3",
      "#6680B3",
      "#66991A",
      "#FF99E6",
      "#CCFF1A",
      "#FF1A66",
      "#E6331A",
      "#33FFCC",
      "#66994D",
      "#B366CC",
      "#4D8000",
      "#B33300",
      "#CC80CC",
      "#66664D",
      "#991AFF",
      "#E666FF",
      "#4DB3FF",
      "#1AB399",
      "#E666B3",
      "#33991A",
      "#CC9999",
      "#B3B31A",
      "#00E680",
      "#4D8066",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC",
      "#9900B3",
      "#E64D66",
      "#4DB380",
      "#FF4D4D",
      "#99E6E6",
      "#6666FF",
    ];
    const margin = { top: 15, right: 30, bottom: 50, left: 40 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;
    const selection = d3
      .select(rootElem.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "svg");

    const sortedArray = data.sort(
      (a: any, b: any) => a.marginal_Abatement_Cost - b.marginal_Abatement_Cost
    );
    const sortedArrayTwo: Array<any> = data.sort(
      (a: any, b: any) => a.marginal_Abatement_Cost - b.marginal_Abatement_Cost
    );
    const uniqueCategories: any = Array.from(
      new Set(sortedArrayTwo.map((d: any) => d.category))
    );
    const categories = uniqueCategories.map((d: any, index: number) => ({
      category: d,
      color: colorArray[index],
    }));

    const max = d3.sum(sortedArrayTwo, (d: any) => d.abatement_Capacity)!;
    const xA = d3
      .scaleLinear()
      .domain([0, max])
      .range([0, svgWidth - 50]);
    const y = d3.scaleLinear().rangeRound([svgHeight - 65, 0]);

    // increate y axis height
    y.domain([
      d3.min(sortedArray, (d: any) => d.marginal_Abatement_Cost)! + -40,
      d3.max(sortedArray, (d: any) => d.marginal_Abatement_Cost)! + 40,
    ]);
    y.ticks(svgHeight / 100);
    // X axis label
    selection
      .append("text")
      .text("Annual GHG emmisions abatement for country X (MtCO₂e)")
      .attr("x", width / 2)
      .attr("y", height - 68)
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize  + 1)
      .attr("font-weight", '500')
      .attr("fill", "#000000");

    // Y axis label
    selection
      .append("text")
      .text("Cost per GHG emmisions reduction (USD/CO₂e)")
      .attr("x", 0)
      .attr("y", svgHeight / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize + 1)
      .attr("font-weight", '500')
      .attr("transform", `rotate(-90-5 ${svgHeight / 2 - 15})`)
      .attr("fill", "#000000");
      
    // Y axis drawer
    selection
      .append("g")
      .attr("transform", `translate(${margin.left + 20},${margin.top})`)
      .attr("font-weight", '500')
      .attr("stroke", "#000000")
      .attr("stroke-width", "0.3px")
      .attr("font-size", fontSize)
      .attr('font-weight', '500')
      .call(d3.axisLeft(y));

    // draw bars
    selection
      .selectAll(".bar")
      .data(sortedArrayTwo)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr(
        "x",
        (d: any, i: number) => 60 + getPreviousXLength(xA, sortedArray, i)
      )
      .attr("y", (d: any) => 15 + y(Math.max(0, d.marginal_Abatement_Cost))!)
      .attr("width", (d: any, i: number) => xA(d.abatement_Capacity)!)
      .attr("height", (d: any) =>
        Math.abs(y(d.marginal_Abatement_Cost)! - y(0)!)
      )
      .attr("fill", (d: any, i: number) => getColor(categories, d.category));

    // bar labels
    selection
      .selectAll(".bar-text")
      .data(sortedArrayTwo)
      .enter()
      .append("text")
      .attr("class", "bar-text")
      .attr(
        "x",
        (d: any, i: number) => 60 + getPreviousXLength(xA, sortedArray, i) + 3
      )
      .attr("y", (d: any, i: number) => {
        if (d.marginal_Abatement_Cost < 0) {
          return (
            y(Math.max(0, d.marginal_Abatement_Cost))! +
            Math.abs(y(d.marginal_Abatement_Cost)! - y(0)!) +
            25
          );
        } else {
          const yValue = y(Math.max(0, d.marginal_Abatement_Cost))! + 5;
          return yValue;
        }
      })
      .attr("fill", "#000000")
      .text((d: any) => d.abatement_Alternative)
      .attr("text-anchor", "left")
      .attr("font-size", fontSize)
      .attr("font-weight", '500')
      .style("alignment-baseline", "middle");

    const xAxis = d3
      .axisBottom(xA)
      .ticks(svgWidth / 100)
      .tickSize(5)
      .tickFormat((d: any, i: number) => {
        return d;
      });

    // bottom x axis
    selection
      .append("g")
      .attr("class", "grid")
      .attr(
        "transform",
        "translate(" + (margin.top - -45) + ", " + (svgHeight - 50) + ")"
      )
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("stroke", "#000000")
      .attr("stroke-width", "0.3px")
      .attr("font-size", fontSize)
      .attr('font-weight', '500')
      .attr("dy", "1em");

    // legends drawing
    // legend container
    selection.append('rect')
      .attr('width', '80')
      .attr('height', (categories.length * 12.5))
      .attr('x', 65)
      .attr('y', 15)
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', '#dfdfdf')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-width', '.5');

    // legends shape
    let size = 12;
    selection
      .selectAll("legend-dots")
      .data(categories)
      .enter()
      .append("rect")
      .attr("x", 70)
      .attr("y", (d: any, i: number) => 18 + i * size)
      .attr("width", 20)
      .attr("height", 7)
      .style("fill", (d: any, i: number) => d.color);

    // legends label
    selection
      .selectAll("legend-lables")
      .data(uniqueCategories)
      .enter()
      .append("text")
      .attr("x", 95)
      .attr("y", (d: any, i: number) => 23 + i * size)
      .style("fill", "#000000")
      .text((d: any) => d)
      .attr("text-anchor", "left")
      .attr("font-size", fontSize)
      .attr("font-weight", '500')
      .style("alignment-baseline", "middle");

      d3.select(rootElem.current).style("font-weight","500");
  };

  const getPreviousXLength = (xA: any, inputArray: any, index: number) => {
    const arr = inputArray.slice(0, index);
    const sum = arr.reduce(
      (sum: number, obj: any) => sum + xA(obj.abatement_Capacity),
      0
    );
    return sum;
  };

  const getColor = (categories: any, name: any) => {
    const colorEle = categories.filter((d: any) => d.category === name);
    if (colorEle.length > 0) {
      return colorEle[0].color;
    }
  };

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    ></Styles>
  );
}
