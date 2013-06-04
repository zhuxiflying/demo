var scatterCharHtml;
nv.models.scatterChart = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var scatter      = nv.models.scatter()
    , xAxis        = nv.models.axis()
    , yAxis        = nv.models.axis()
    , legend       = nv.models.legend()
    , controls     = nv.models.legend()
    , distX        = nv.models.distribution()
    , distY        = nv.models.distribution()
    ;

  var margin       = {top: 30, right: 20, bottom: 50, left: 60}
    , width        = null
    , height       = null
    , color        = nv.utils.defaultColor()
    , x            = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.xScale()
    , y            = d3.fisheye ? d3.fisheye.scale(d3.scale.linear).distortion(0) : scatter.yScale()
    , showDistX    = false
    , showDistY    = false
    , showLegend   = true
    , showControls = !!d3.fisheye
    , fisheye      = 0
    , pauseFisheye = false
    , tooltips     = true
    , tooltipX     = function(key, x, y) { return '<strong>' + x + '</strong>' }
    , tooltipY     = function(key, x, y) { return '<strong>' + y + '</strong>' }
    //, tooltip      = function(key, x, y) { return '<h3>' + key + '</h3>' }
    , tooltip      = null
    , dispatch     = d3.dispatch('tooltipShow', 'tooltipHide')
    , noData       = "No Data Available."
    ;

  scatter
    .xScale(x)
    .yScale(y)
    ;
  xAxis
    .orient('bottom')
    .tickPadding(10)
    ;
  yAxis
    .orient('left')
    .tickPadding(10)
    ;
  distX
    .axis('x')
    ;
  distY
    .axis('y')
    ;

  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var x0, y0;

  var showTooltip = function(e, offsetElement) {
    //TODO: make tooltip style an option between single or dual on axes (maybe on all charts with axes?)

    var left = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
        top = e.pos[1] + ( offsetElement.offsetTop || 0),
        leftX = e.pos[0] + ( offsetElement.offsetLeft || 0 ),
        topX = y.range()[0] + margin.top + ( offsetElement.offsetTop || 0),
        leftY = x.range()[0] + margin.left + ( offsetElement.offsetLeft || 0 ),
        topY = e.pos[1] + ( offsetElement.offsetTop || 0),
        xVal = xAxis.tickFormat()(scatter.x()(e.point, e.pointIndex)),
        yVal = yAxis.tickFormat()(scatter.y()(e.point, e.pointIndex));

      if( tooltipX != null )
          nv.tooltip.show([leftX, topX], tooltipX(e.series.key, xVal, yVal, e, chart), 'n', 1, offsetElement, 'x-nvtooltip');
      if( tooltipY != null )
          nv.tooltip.show([leftY, topY], tooltipY(e.series.key, xVal, yVal, e, chart), 'e', 1, offsetElement, 'y-nvtooltip');
      if( tooltip != null )
          nv.tooltip.show([left, top], tooltip(e.series.key, xVal, yVal, e, chart), e.value < 0 ? 'n' : 's', null, offsetElement);
  };

  var controlsData = [
    { key: 'Magnify', disabled: true }
  ];

  //============================================================


  function chart(selection) {
    selection.each(function(data) {
      var container = d3.select(this),
          that = this;

      var availableWidth = (width  || parseInt(container.style('width')) || 960)
                             - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;


      //------------------------------------------------------------
      // Display noData message if there's nothing to show.

      if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
        container.append('text')
          .attr('class', 'nvd3 nv-noData')
          .attr('x', availableWidth / 2)
          .attr('y', availableHeight / 2)
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle')
          .text(noData);
          return chart;
      } else {
        container.select('.nv-noData').remove();
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Scales

      x = scatter.xScale();
      y = scatter.yScale();

      x0 = x0 || x;
      y0 = y0 || y;

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-scatterChart').data([data]);
      var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-scatterChart nv-chart-' + scatter.id());
      var gEnter = wrapEnter.append('g');
      var g = wrap.select('g')

      // background for pointer events
      gEnter.append('rect').attr('class', 'nvd3 nv-background')

      gEnter.append('g').attr('class', 'nv-x nv-axis');
      gEnter.append('g').attr('class', 'nv-y nv-axis');
      gEnter.append('g').attr('class', 'nv-scatterWrap');
      gEnter.append('g').attr('class', 'nv-distWrap');
      gEnter.append('g').attr('class', 'nv-legendWrap');
      gEnter.append('g').attr('class', 'nv-controlsWrap');

      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Legend

      if (showLegend) {
        legend.width( availableWidth / 2 );

        wrap.select('.nv-legendWrap')
            .datum(data)
            .call(legend);

        if ( margin.top != legend.height()) {
          margin.top = legend.height();
          availableHeight = (height || parseInt(container.style('height')) || 400)
                             - margin.top - margin.bottom;
        }

        wrap.select('.nv-legendWrap')
            .attr('transform', 'translate(' + (availableWidth / 2) + ',' + (-margin.top) +')');
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Controls

      if (showControls) {
        controls.width(180).color(['#444']);
					

	   
	   g.select('.nv-controlsWrap')
            .datum(controlsData)
            .attr('transform', 'translate(0,' + (-margin.top) +')')
            .call(controls);
		
		var height = $(window).height()-$('#header').outerHeight(true);
		
		
		var pos = ($(window).height()-$('#header').height())/2;
		
		//alert('height:'+height);
		
		//abscissa and ordinate selection
		var abscissaSelect = $('div#row2 select#abscissa'); // TODO: dynamicly populate combobox
		abscissaSelect.html("");
		abscissaSelect.append('<option id="ShapeCompactness">ShapeCompactness</option>');
		abscissaSelect.append('<option id="Popequality">Popequality</option>');
		
        var scatterHtml=document.getElementById("scatterId");
		scatterHtml.innerHTML='';
		
		scatterCharHtml='<div id="col1" class="cell chartWrap fullwidth" style="height: 460.19047619047615px; width: 1912px; display: inline-block;">';
		scatterCharHtml+='<div style="margin:0px auto;text-align:center;background-color:White;"><select><option id="ordinateLine">ShapeCompactness</option><option id="ordinateLine">Popequality</option></select><select><option id="ordinateLine">ShapeCompactness</option><option id="ordinateLine">Popequality</option></select></div>';
		scatterCharHtml+='<div id="sidepanel" style="position:absolute;left:1px;top:'+pos+'px;"><ul id="sidepanel_tabs"><li><button id="filterTab" class="tab1 selectedPlan" onClick="changePlan(this.id);">Plans</button></li><li><button id="configureTab" class="tab1" onClick="changePlan(this.id);">District Info</button></li></ul></div>';
		scatterCharHtml+='<div id="controlPlan"  style="height: 458.19047619047615px; width: 1912px; display: inline-block;"><svg class="nvd3"><g class="nvd3 nv-wrap nv-scatterChart nv-chart-95466" transform="translate(70,30)"><g>';
		scatterCharHtml+='<rect class="nvd3 nv-background" width="1832" height="388"></rect>';
		scatterCharHtml+='<g class="nv-x nv-axis" transform="translate(0,388)"><g class="nvd3 nv-wrap nv-axis"><g><g transform="translate(93.94039751497368,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">May-13</text></g><g transform="translate(229.7575150325166,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">May-20</text></g><g transform="translate(365.5746325500596,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">May-27</text></g><g transform="translate(501.3917500676025,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jun-03</text></g><g transform="translate(637.2088675851454,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jun-10</text></g><g transform="translate(773.0259851026883,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jun-17</text></g><g transform="translate(908.8431026202313,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jun-24</text></g><g transform="translate(1044.6602201377743,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jul-01</text></g><g transform="translate(1180.4773376553173,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jul-08</text></g><g transform="translate(1316.2944551728601,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jul-15</text></g><g transform="translate(1452.1115726904031,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jul-22</text></g><g transform="translate(1587.928690207946,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Jul-29</text></g><g transform="translate(1723.745807725489,0)" style="opacity: 1;">';
		//scatterCharHtml+='<line class="tick" y2="-388" x2="0"></line><text y="10" dy=".71em" text-anchor="middle" x="0">Aug-05</text>';
		scatterCharHtml+='</g><path class="domain" d="M0,0V0H1832V0"></path>';
		
		scatterCharHtml+='<text class="nv-axislabel" text-anchor="middle" y="30" x="916">Date (day)</text></g><g class="nv-axisMaxMin" transform="translate(0,0)"><text dy=".71em" y="10" transform="rotate(0 0,0)" text-anchor="end">May-08</text></g>';
		scatterCharHtml+='<g class="nv-axisMaxMin" transform="translate(1832,0)"><text dy=".71em" y="10" transform="rotate(0 0,0)" text-anchor="end">Aug-10';
		scatterCharHtml+='</text></g></g></g><g class="nv-y nv-axis"><g class="nvd3 nv-wrap nv-axis"><g>';
		
		scatterCharHtml+='<g transform="translate(0,361.6033436672379)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">2.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,334.3673137065949)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">4.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,307.13128374595203)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">6.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,279.89525378530914)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">8.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,252.65922382466616)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">10.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,225.4231938640232)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">12.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,198.18716390338028)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">14.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,170.9511339427374)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">16.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,143.71510398209443)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">18.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,116.47907402145154)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">20.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,89.24304406080854)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">22.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,62.007014100165634)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">24.00</text></g>';
		scatterCharHtml+='<g transform="translate(0,34.77098413952268)" style="opacity: 1;"><line class="tick" x2="1832" y2="0"></line><text x="-10" dy=".32em" text-anchor="end" y="0">26.00</text></g>';
		
		scatterCharHtml+='<path class="domain" d="M0,0H0V388H0"></path><text class="nv-axislabel" text-anchor="middle" transform="rotate(-90)" y="-48" x="-194">Distance (km)</text></g>';
		
		scatterCharHtml+='<g class="nv-axisMaxMin" transform="translate(0,388)"><text dy=".32em" y="0" x="-10" text-anchor="end" style="opacity: 1;">0</text></g><g class="nv-axisMaxMin" transform="translate(0,0)">';
		scatterCharHtml+='<text dy=".32em" y="0" x="-10" text-anchor="end" style="opacity: 1;">28</text></g></g></g>';
		
		scatterCharHtml+='<g class="nv-scatterWrap"><g class="nvd3 nv-wrap nv-scatter nv-chart-95466" transform="translate(0,0)"><defs><clipPath id="nv-edge-clip-95466"><rect width="1832" height="388"></rect></clipPath>';
		scatterCharHtml+='<clipPath id="nv-points-clip-95466"><circle r="25" cx="0" cy="269.90480905297676"></circle><circle r="25" cx="2.883643528511243" cy="385.1339412470702"></circle>';
		scatterCharHtml+='<circle r="25" cx="3.84388492154069" cy="385.0366512580468"></circle><circle r="25" cx="8.475320489797882" cy="273.7128613333885"></circle>';
		scatterCharHtml+='<circle r="25" cx="39.08649565542645" cy="315.17561913517864"></circle><circle r="25" cx="40.368539180427426" cy="320.27733683773437"></circle>';
		

		scatterCharHtml+='<circle r="25" cx="1831.855604487125" cy="387.39726780452366"></circle><circle r="25" cx="1832.0000000011114" cy="384.6487126983845"></circle></clipPath></defs>';
		
		scatterCharHtml+='<g clip-path=""><g class="nv-groups"><g class="nv-group nv-series-0" style="stroke-opacity: 1; fill-opacity: 0.5;">';
		scatterCharHtml+='<path transform="translate(0,269.90480905279884)" d="M0,8.749652460145327A8.749652460145327,8.749652460145327 0 1,1 0,-8.749652460145327A8.749652460145327,8.749652460145327 0 1,1 0,8.749652460145327Z" class="nv-point nv-point-0" stroke="#0df233" fill="#0df233" style="pointer-events: auto;"></path>';
		scatterCharHtml+='<path transform="translate(2.883643528509869,385.13394124680195)" d="M0,2.7054422763358796A2.7054422763358796,2.7054422763358796 0 1,1 0,-2.7054422763358796A2.7054422763358796,2.7054422763358796 0 1,1 0,2.7054422763358796Z" class="nv-point nv-point-1" stroke="#0df233" fill="#0df233" style="pointer-events: auto;"></path>';

			
		scatterCharHtml+='<path transform="translate(1832,384.6487126981333)" d="M0,2.7587993985329216A2.7587993985329216,2.7587993985329216 0 1,1 0,-2.7587993985329216A2.7587993985329216,2.7587993985329216 0 1,1 0,2.7587993985329216Z" class="nv-point nv-point-299" stroke="#0df233" fill="#0df233" style="pointer-events: auto;"></path></g></g><g class="nv-point-paths" clip-path="url(#nv-points-clip-95466)"></g></g></g></g><g class="nv-distWrap"></g><g class="nv-legendWrap"></g><g class="nv-controlsWrap" transform="translate(0,-30)"><g class="nvd3 nv-legend" transform="translate(0,5)"><g transform="translate(111,5)"></g></g></g></g></g></svg></div></div>';
		
		scatterHtml.innerHTML=scatterCharHtml;
	
        //abscissa onchange event redraw    		
		abscissaSelect.on('change', function(d,i){
		
		//alert($("#abscissa").find("option:selected").text());
		   
		d.disabled = !d.disabled;

        fisheye = d.disabled ? 0 : 2.5;
        g.select('.nv-background') .style('pointer-events', d.disabled ? 'none' : 'all');
        g.select('.nv-point-paths').style('pointer-events', d.disabled ? 'all' : 'none' );

        if (d.disabled) {
        x.distortion(fisheye).focus(0);
        y.distortion(fisheye).focus(0);

        g.select('.nv-scatterWrap').call(scatter);
        g.select('.nv-x.nv-axis').call(xAxis);
        g.select('.nv-y.nv-axis').call(yAxis);
        } else {
          pauseFisheye = false;
        } 
        //redraw 
        //chart(selection);
		});
		
		
		//ordinate create option
		var ordinateSelect = $('div#row2 select#ordinate'); // TODO: dynamicly populate combobox
		ordinateSelect.html("");
		ordinateSelect.append('<option id="ordinateLine">ShapeCompactness</option>');
		ordinateSelect.append('<option id="ordinateLine">Popequality</option>');
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Main Chart Component(s)

      scatter
          .width(availableWidth)
          .height(availableHeight)

      wrap.select('.nv-scatterWrap')
          .datum(data.filter(function(d) { return !d.disabled }))
          .call(scatter);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Axes

      xAxis
          .scale(x)
          .ticks( xAxis.ticks() ? xAxis.ticks() : availableWidth / 100 )
          .tickSize( -availableHeight , 0);

      g.select('.nv-x.nv-axis')
          .attr('transform', 'translate(0,' + y.range()[0] + ')')
          .call(xAxis);


      yAxis
          .scale(y)
          .ticks( yAxis.ticks() ? yAxis.ticks() : availableHeight / 36 )
          .tickSize( -availableWidth, 0);

      g.select('.nv-y.nv-axis')
          .call(yAxis);


      if (showDistX) {
        distX
            .getData(scatter.x())
            .scale(x)
            .width(availableWidth)
            .color(data.map(function(d,i) { //TODO: revisit this
              return d.color || color(d, i);
            }).filter(function(d,i) { return !data[i].disabled }));
        gEnter.select('.nv-distWrap').append('g')
            .attr('class', 'nv-distributionX')
            .attr('transform', 'translate(0,' + y.range()[0] + ')');
        g.select('.nv-distributionX')
            .datum(data.filter(function(d) { return !d.disabled }))
            .call(distX);
      }

      if (showDistY) {
        distY
            .getData(scatter.y())
            .scale(y)
            .width(availableHeight)
            .color(data.map(function(d,i) { //TODO: revisit this
              return d.color || color(d, i);
            }).filter(function(d,i) { return !data[i].disabled }));
        gEnter.select('.nv-distWrap').append('g')
            .attr('class', 'nv-distributionY')
            .attr('transform', 'translate(-' + distY.size() + ',0)');
        g.select('.nv-distributionY')
            .datum(data.filter(function(d) { return !d.disabled }))
            .call(distY);
      }

      //------------------------------------------------------------




      if (d3.fisheye) {
        g.select('.nv-background')
            .attr('width', availableWidth)
            .attr('height', availableHeight);

        g.select('.nv-background').on('mousemove', updateFisheye);
        g.select('.nv-background').on('click', function() { pauseFisheye = !pauseFisheye;});
        scatter.dispatch.on('elementClick.freezeFisheye', function() {
          pauseFisheye = !pauseFisheye;
        });
      }
	  
      function updateFisheye() {
        if (pauseFisheye) {
          g.select('.nv-point-paths').style('pointer-events', 'all');
          return false;
        }

        g.select('.nv-point-paths').style('pointer-events', 'none' );

        var mouse = d3.mouse(this);
        x.distortion(fisheye).focus(mouse[0]);
        y.distortion(fisheye).focus(mouse[1]);

        g.select('.nv-scatterWrap')
            .datum(data.filter(function(d) { return !d.disabled }))
            .call(scatter);
        g.select('.nv-x.nv-axis').call(xAxis);
        g.select('.nv-y.nv-axis').call(yAxis);
        g.select('.nv-distributionX')
            .datum(data.filter(function(d) { return !d.disabled }))
            .call(distX);
        g.select('.nv-distributionY')
            .datum(data.filter(function(d) { return !d.disabled }))
            .call(distY);
      }
	  
      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      controls.dispatch.on('legendClick', function(d,i) {
	  
        d.disabled = !d.disabled;

        fisheye = d.disabled ? 0 : 2.5;
        g.select('.nv-background') .style('pointer-events', d.disabled ? 'none' : 'all');
        g.select('.nv-point-paths').style('pointer-events', d.disabled ? 'all' : 'none' );

        if (d.disabled) {
          x.distortion(fisheye).focus(0);
          y.distortion(fisheye).focus(0);

          g.select('.nv-scatterWrap').call(scatter);
          g.select('.nv-x.nv-axis').call(xAxis);
          g.select('.nv-y.nv-axis').call(yAxis);
        } else {
          pauseFisheye = false;
        } 

        chart(selection);
      });

      legend.dispatch.on('legendClick', function(d,i, that) {
        d.disabled = !d.disabled;

        if (!data.filter(function(d) { return !d.disabled }).length) {
          data.map(function(d) {
            d.disabled = false;
            wrap.selectAll('.nv-series').classed('disabled', false);
            return d;
          });
        }

        chart(selection);
      });

      /*
      legend.dispatch.on('legendMouseover', function(d, i) {
        d.hover = true;
        chart(selection);
      });

      legend.dispatch.on('legendMouseout', function(d, i) {
        d.hover = false;
        chart(selection);
      });
      */

      scatter.dispatch.on('elementMouseover.tooltip', function(e) {
        d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-distx-' + e.pointIndex)
            .attr('y1', e.pos[1] - availableHeight);
        d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-disty-' + e.pointIndex)
            .attr('x2', e.pos[0] + distX.size());

        e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
        dispatch.tooltipShow(e);
      });

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) showTooltip(e, that.parentNode);
      });

      //============================================================


      //store old scales for use in transitions on update
      x0 = x.copy();
      y0 = y.copy();


      chart.update = function() { chart(selection) };
      chart.container = this;

    });

    return chart;
  }


  //============================================================
  // Event Handling/Dispatching (out of chart's scope)
  //------------------------------------------------------------

  scatter.dispatch.on('elementMouseout.tooltip', function(e) {
    dispatch.tooltipHide(e);

    d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-distx-' + e.pointIndex)
        .attr('y1', 0);
    d3.select('.nv-chart-' + scatter.id() + ' .nv-series-' + e.seriesIndex + ' .nv-disty-' + e.pointIndex)
        .attr('x2', distY.size());
  });
  dispatch.on('tooltipHide', function() {
    if (tooltips) nv.tooltip.cleanup();
  });

  //============================================================


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.scatter = scatter;
  chart.legend = legend;
  chart.controls = controls;
  chart.xAxis = xAxis;
  chart.yAxis = yAxis;
  chart.distX = distX;
  chart.distY = distY;

  d3.rebind(chart, scatter, 'id', 'interactive', 'pointActive', 'x', 'y', 'shape', 'size', 'color', 'xScale', 'yScale', 'sizeScale', 'colorScale', 'xDomain', 'yDomain', 'sizeDomain', 'colorDomain', 'sizeRange', 'colorRange', 'forceX', 'forceY', 'forceSize', 'forceColor', 'clipVoronoi', 'clipRadius', 'useVoronoi');

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = nv.utils.getColor(_);
    legend.color(color);
    distX.color(color);
    distY.color(color);
    return chart;
  };

  chart.showDistX = function(_) {
    if (!arguments.length) return showDistX;
    showDistX = _;
    return chart;
  };

  chart.showDistY = function(_) {
    if (!arguments.length) return showDistY;
    showDistY = _;
    return chart;
  };

  chart.showControls = function(_) {
    if (!arguments.length) return showControls;
    showControls = _;
    return chart;
  };

  chart.showLegend = function(_) {
    if (!arguments.length) return showLegend;
    showLegend = _;
    return chart;
  };

  chart.fisheye = function(_) {
    if (!arguments.length) return fisheye;
    fisheye = _;
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) return tooltips;
    tooltips = _;
    return chart;
  };

  chart.tooltipContent = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.tooltipXContent = function(_) {
    if (!arguments.length) return tooltipX;
    tooltipX = _;
    return chart;
  };

  chart.tooltipYContent = function(_) {
    if (!arguments.length) return tooltipY;
    tooltipY = _;
    return chart;
  };

  chart.noData = function(_) {
    if (!arguments.length) return noData;
    noData = _;
    return chart;
  };

  //============================================================


  return chart;
}


function changePlan(id){
	if(id=='filterTab'){
	   var filter=document.getElementById('filterTab');
	   filter.className ="tab1 selectedPlan";

	   var configure =document.getElementById('configureTab');
	   configure.className ="tab1";
	   
	   var controlPlan=document.getElementById('scatterId');
	   controlPlan.innerHTML='';
	   controlPlan.innerHTML=scatterCharHtml;
	   //alert(scatterCharHtml);
	}else{
	   var filter=document.getElementById('filterTab');
	   filter.className ="tab1";

	   var configure =document.getElementById('configureTab');
	   configure.className ="tab1 selectedPlan";
	   
	   var controlPlan=document.getElementById('controlPlan');

	   controlPlan.innerHTML='4444444444444444444444';

	}
};