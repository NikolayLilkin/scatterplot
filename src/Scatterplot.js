import { Component } from "react";
import * as d3 from 'd3';

class Scatterplot extends Component{
    constructor(props){
        super(props)
        this.drawScatterPlot = this.drawScatterPlot.bind(this);
    }
    componentDidMount(){
        this.drawScatterPlot();
    }
    drawScatterPlot(){
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(response => response.json())
        .then(data => {
            let array = [];
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                array.push(element);
            }
            var maxTime=d3.max(array,(d,i) => {
                return d["Seconds"];
            });
            var minTime= d3.min(array,(d,i)=> {
                return d["Seconds"];
            });
            var maxYear = d3.max(array,(d,i)=> {
                return d["Year"]
            });
            var minYear = d3.min(array,(d,i)=> {
                return d["Year"]
            });
            var margin = {top: 10, right: 30, bottom: 90, left: 40},
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;  
            var svg = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("border", "1px solid black")
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            var x = d3.scaleLinear();
            x.range([ 0, width])
            x.domain([minYear-1,maxYear+1]);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(10,0)rotate(-45)")
            .style("text-anchor", "end");
            var y = d3.scaleLinear();
            y.range([height,0])
            y.domain([maxTime,minTime]);
            svg.append("g").call(d3.axisLeft(y).ticks(13)).attr("transform", "translate(0," + 0 + ")").selectAll("text").text((d,i) =>{
                let result=""+Math.floor(d / 60)+":"+(d%60);
                if(result.length===4) result +="0";
                return result;
            });

            const tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "#fff")
            .text("a simple tooltip");

            svg.append('g')
            .selectAll("dot")
            .data(array)
            .enter()
            .append("circle")
            .attr("cx", function (d,i) { return x(d["Year"]); } )
            .attr("cy", function (d,i) { return y(d["Seconds"]); } )
            .attr("r", 5)
            .style("fill", function(d,i) {
                if(!d.Doping) return "orange"
                return "#69b3a2"
            })
            .on("mouseover", function(d, i) {
                console.log(i);
                tooltip.html(i.Doping ? (`<div>${i.Name}:${i.Nationality} <br/><br/>
                                Year: ${i.Year}, Time: ${i.Time} <br/><br/>
                                ${i.Doping} <br/>
                            </div>`):(`<div>${i.Name}:${i.Nationality} <br/><br/>
                            ${i.Year},${i.Time}<br/><br/></div>`)).style("visibility", "visible");
              })
              .on("mousemove", function(event){
                tooltip
                  .style("top", (event.pageY-10)+"px")
                  .style("left",(event.pageX+10)+"px");
              })
              .on("mouseout", function() {
                tooltip.html(``).style("visibility", "hidden");
                d3.select(this).attr("fill", "#69b3a2");
              });
            svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+55)
            .attr("x", -margin.top-20)
            .style("fill","white")
            .style("font-size","16")
            .text("Time in Minutes");

            svg.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x',700)
            .attr('y',100)
            .attr('fill', 'orange');
            svg.append('rect')
            .attr('width', 16)
            .attr('height', 16)
            .attr('x',700)
            .attr('y',123)
            .attr('fill', '#69b3a2');
            svg.append('text')
            .attr('x',600)
            .attr('y',113)
            .attr('fill','white')
            .style('font-size',10)
            .text("No doping alligation")
            svg.append('text')
            .attr('x',560)
            .attr('y',136)
            .attr('fill','white')
            .style('font-size',10)
            .text("Riders with doping alligation")
        
        }).catch(function(error)
        {
            console.log(error);
        });
        }
    render(){
        return (<div ref="canvas">
        </div>);
    }
}

export default Scatterplot;