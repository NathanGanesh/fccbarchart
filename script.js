//https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
//json data
// d3.json() --> possibiltiy
//https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
// var d3 = require('d3');
(async function() {
	try {
		const jsonResponse = await d3.json(
			'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
		);

		const dataset = jsonResponse.data; // dataset
		let dateArray = [];
		for (let i = 0; i < dataset.length; i++) {
			dateArray[i] = new Date(dataset[i][0]);
		}
		// console.log(dateArray);
		// fucks up the arrray
		// let datesArray = dataset.map((item) => {
		//     return new Date()
		// })

		//275 values in the form
		// ["1947-01-01",243.1],
		// console.log(dataset[0]); //date x-as
		// console.log(dataset[1]); // gdp y-as
		const w = 800;
		const h = 600;
		const padding = 40;

		console.log(dataset); //dataset

		const highestValY = d3.max(dataset, (d) => d[1]);
		// console.log(highestValY);
		const LowestValY = d3.min(dataset, (d) => d[1]);
		// console.log(LowestValY);
		const LowestValX = d3.min(dataset, (d) => d[0]);
		// console.log(LowestValX);
		const highestValX = d3.max(dataset, (d) => d[0]);

		const heightScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(dataset, (item) => {
					return item[1];
				})
			])
			.range([ 0, h - 2 * padding ]);

		//scalers
		const xScale = d3.scaleTime().domain([ d3.min(dateArray), d3.max(dateArray) ]).range([ padding, w - padding ]);

		const xScaleForBarsWidth = d3.scaleLinear().domain([ 0, dataset.length - 1 ]).range([ padding, w - padding ]);

		const yScale = d3.scaleLinear().domain([ 0, d3.max(dataset, (d) => d[1]) ]).range([ h - padding, padding ]);

		const svg = d3.select('#canvas').attr('width', w).attr('height', h);

		let toolTip = d3
			.select('body')
			.append('div')
			.attr('id', 'tooltip')
			.style('visibility', 'hidden')
			.style('width', 'auto')
			.style('heigth', 'auto');
		//loading dataset
		svg
			.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('width', (w - 2 * padding) / dataset.length)
			.attr('data-date', (item) => {
				return item[0];
			})
			.attr('data-gdp', (item) => {
				return item[1];
			})
			.attr('height', (item) => {
				return heightScale(item[1]);
			})
			.attr('x', (item, index) => {
				return xScaleForBarsWidth(index);
			})
			.attr('y', (item) => {
				return h - padding - heightScale(item[1]);
			})
			.on('mouseover', (item) => {
				toolTip.transition().style('visibility', 'visible');

				toolTip.text(item[0]);

				document.querySelector('#tooltip').setAttribute('data-date', item[0]);
			})
			.on('mouseout', (item) => {
				toolTip.transition().style('visibility', 'hidden');
			});

		//x,y as

		const xAxis = d3.axisBottom(xScale);

		const yAxis = d3.axisLeft(yScale);

		svg.append('g').attr('transform', 'translate(0,' + (h - padding) + ')').attr('id', 'x-axis').call(xAxis);
		svg.append('g').attr('transform', 'translate(' + padding + ',0)').attr('id', 'y-axis').call(yAxis);
	} catch (error) {
		console.log(error);
	}
})();
