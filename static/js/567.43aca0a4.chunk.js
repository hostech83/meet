"use strict";(self.webpackChunkmeet=self.webpackChunkmeet||[]).push([[567],{1567:(t,e,r)=>{r.r(e),r.d(e,{default:()=>u});var a=r(5043),s=r(108),n=r(2458),i=r(7734),o=r(2185),l=r(6026),c=r(6150),d=r(7943),h=r(579);const u=t=>{let{events:e,allLocations:r}=t;const[u,x]=(0,a.useState)([]),[y,m]=(0,a.useState)(window.innerWidth);(0,a.useEffect)((()=>{const t=()=>m(window.innerWidth);return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[]);const f=(0,a.useMemo)((()=>{if(!Array.isArray(r)||!Array.isArray(e)||0===r.length||0===e.length)return[];return r.map((t=>{const r=e.filter((e=>e.location===t)).length;return{city:t.split(/, | - /)[0],count:r}}))}),[r,e]);(0,a.useEffect)((()=>{x(f)}),[f]);const b=t=>{let{x:e,y:r,payload:a}=t;const s=y<=450,n=s?60:45;return(0,h.jsx)("g",{transform:`translate(${e},${r})`,children:(0,h.jsx)("text",{x:0,y:0,dy:16,textAnchor:"start",stroke:"white",transform:`rotate(${n})`,"data-testid":`XAxislabel-${a.value}`,className:"recharts-text recharts-cartesian-axis-tick-value x-axis-label",style:{fontSize:s?"10px":"12px"},children:a.value})})};if(0===u.length)return(0,h.jsx)("div",{children:"No data available for chart"});const p=y<=450?{top:10,right:10,bottom:40,left:-15}:{top:20,right:20,bottom:50,left:-15};return(0,h.jsxs)("div",{"data-testid":"scatterChart",children:[(0,h.jsx)("div",{className:"chartGroup",children:"# of Events Per Location"}),(0,h.jsx)(s.u,{width:"99%",height:400,style:{backgroundColor:"#143B5F"},role:"chart","aria-label":"scatterChart",className:"scatterChart","data-testid":"scatterChartSVG",children:(0,h.jsxs)(n.t,{role:"graphics-document","data-testid":"scatterChartSVG",className:"scatterChart","aria-label":"scatterChart",style:{backgroundColor:"#143B5F"},margin:p,children:[(0,h.jsx)(i.d,{stroke:"#495670"}),(0,h.jsx)(o.W,{type:"category",dataKey:"city",name:"City",tick:(0,h.jsx)(b,{}),interval:0,stroke:"white"}),(0,h.jsx)(l.h,{type:"number",dataKey:"count",name:"Number of Events",allowDecimals:!1,stroke:"white",label:{value:"Number of Events",angle:-90,position:"center",fill:"white",style:{fontSize:y<=320?"12px":"14px"}}}),(0,h.jsx)(c.m,{cursor:{strokeDasharray:"3 3"},contentStyle:{backgroundColor:"#FFEEE6",color:"#ECF0F1",border:"1px solid #ECF0F1"}}),(0,h.jsx)(d.X,{name:"Events by City",data:u,fill:"white"})]})})]})}}}]);
//# sourceMappingURL=567.43aca0a4.chunk.js.map