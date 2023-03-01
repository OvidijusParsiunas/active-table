"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[864],{5162:(e,t,a)=>{a.d(t,{Z:()=>o});var l=a(7294),n=a(6010);const r={tabItem:"tabItem_Ymn6"};function o(e){let{children:t,hidden:a,className:o}=e;return l.createElement("div",{role:"tabpanel",className:(0,n.Z)(r.tabItem,o),hidden:a},t)}},4866:(e,t,a)=>{a.d(t,{Z:()=>T});var l=a(7462),n=a(7294),r=a(6010),o=a(2466),i=a(6550),s=a(1980),d=a(7392),u=a(12);function p(e){return function(e){return n.Children.map(e,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:a,attributes:l,default:n}}=e;return{value:t,label:a,attributes:l,default:n}}))}function c(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??p(a);return function(e){const t=(0,d.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function m(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:a}=e;const l=(0,i.k6)(),r=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,s._X)(r),(0,n.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(l.location.search);t.set(r,e),l.replace({...l.location,search:t.toString()})}),[r,l])]}function h(e){const{defaultValue:t,queryString:a=!1,groupId:l}=e,r=c(e),[o,i]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const l=a.find((e=>e.default))??a[0];if(!l)throw new Error("Unexpected error: 0 tabValues");return l.value}({defaultValue:t,tabValues:r}))),[s,d]=b({queryString:a,groupId:l}),[p,h]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[l,r]=(0,u.Nk)(a);return[l,(0,n.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:l}),k=(()=>{const e=s??p;return m({value:e,tabValues:r})?e:null})();(0,n.useLayoutEffect)((()=>{k&&i(k)}),[k]);return{selectedValue:o,selectValue:(0,n.useCallback)((e=>{if(!m({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),h(e)}),[d,h,r]),tabValues:r}}var k=a(2389);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:t,block:a,selectedValue:i,selectValue:s,tabValues:d}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,o.o5)(),c=e=>{const t=e.currentTarget,a=u.indexOf(t),l=d[a].value;l!==i&&(p(t),s(l))},m=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=u.indexOf(e.currentTarget)+1;t=u[a]??u[0];break}case"ArrowLeft":{const a=u.indexOf(e.currentTarget)-1;t=u[a]??u[u.length-1];break}}t?.focus()};return n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":a},t)},d.map((e=>{let{value:t,label:a,attributes:o}=e;return n.createElement("li",(0,l.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>u.push(e),onKeyDown:m,onClick:c},o,{className:(0,r.Z)("tabs__item",x.tabItem,o?.className,{"tabs__item--active":i===t})}),a??t)})))}function y(e){let{lazy:t,children:a,selectedValue:l}=e;if(a=Array.isArray(a)?a:[a],t){const e=a.find((e=>e.props.value===l));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return n.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==l}))))}function v(e){const t=h(e);return n.createElement("div",{className:(0,r.Z)("tabs-container",x.tabList)},n.createElement(f,(0,l.Z)({},e,t)),n.createElement(y,(0,l.Z)({},e,t)))}function T(e){const t=(0,k.Z)();return n.createElement(v,(0,l.Z)({key:String(t)},e))}},9814:(e,t,a)=>{a.d(t,{Z:()=>n});var l=a(7294);function n(){return l.createElement("div",{style:{height:"1px"}})}},1853:(e,t,a)=>{function l(e){window.scrollY>0?e.style.boxShadow="0 1px 2px 0 rgb(0 0 0 / 10%)":e.style.boxShadow="unset"}function n(){setTimeout((()=>{window.removeEventListener("scroll",window.toggleNavOnScroll);const e=document.getElementsByClassName("navbar--fixed-top");if(e[0]){const t=e[0];l(t),window.toggleNavOnScroll=l.bind(this,t),window.addEventListener("scroll",window.toggleNavOnScroll)}}),2)}function r(){setTimeout((()=>{const e=document.querySelectorAll(".plugin-pages > body > #__docusaurus > nav")?.[0];e&&e.classList.add("fade-in")}),2)}a.r(t),a.d(t,{fadeIn:()=>r,readdAutoNavToggle:()=>n})},9272:(e,t,a)=>{a.d(t,{Z:()=>r,v:()=>n});var l=a(7294);function n(e){return e?.children[0]?.children[0]}function r(e){let{children:t,minHeight:a}=e;return l.createElement("div",{className:"documentation-example-container",style:{minHeight:`${a||346}px`}},l.createElement("div",null,t))}},5222:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>b,contentTitle:()=>c,default:()=>f,frontMatter:()=>p,metadata:()=>m,toc:()=>h});var l=a(7462),n=(a(7294),a(3905)),r=a(4336),o=a(9272),i=a(9814),s=a(1262),d=a(5162),u=a(4866);const p={sidebar_position:5},c="Header",m={unversionedId:"header",id:"header",title:"Header",description:"Properties related to the header cells.",source:"@site/docs/header.mdx",sourceDirName:".",slug:"/header",permalink:"/docs/header",draft:!1,editUrl:"https://github.com/OvidijusParsiunas/active-table/tree/main/website/docs/header.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"defaultSidebar",previous:{title:"Content",permalink:"/docs/content"},next:{title:"Row",permalink:"/docs/row"}},b={},h=[{value:"<code>headerStyles</code>",id:"headerStyles",level:3},{value:"Example",id:"example",level:4},{value:"<code>isHeaderTextEditable</code>",id:"isHeaderTextEditable",level:3},{value:"Example",id:"example-1",level:4},{value:"<code>allowDuplicateHeaders</code>",id:"allowduplicateheaders",level:3},{value:"Example for false",id:"example-for-false",level:4},{value:"<code>displayHeaderIcons</code>",id:"displayHeaderIcons",level:3},{value:"Example for false",id:"example-for-false-1",level:4},{value:"<code>headerIconStyle</code>",id:"HeaderIconStyle",level:3},{value:"Example",id:"example-2",level:4},{value:"<code>stickyHeader</code>",id:"stickyHeader",level:3},{value:"Example",id:"example-3",level:4},{value:"<code>dataStartsAtHeader</code>",id:"dataStartsAtHeader",level:3},{value:"Example",id:"example-4",level:4}],k={toc:h},x="wrapper";function f(e){let{components:t,...p}=e;return(0,n.kt)(x,(0,l.Z)({},k,p,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"header"},"Header"),(0,n.kt)("p",null,"Properties related to the header cells."),(0,n.kt)("h3",{id:"headerStyles"},(0,n.kt)("inlineCode",{parentName:"h3"},"headerStyles")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("a",{parentName:"li",href:"./sharedTypes#HoverableStyles"},(0,n.kt)("inlineCode",{parentName:"a"},"HoverableStyles"))),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"unset"))),(0,n.kt)("p",null,"Styling details for the header elements in default and mouse hover states. To prevent the frame\ncomponent (index and add new column) from inheriting the header style, set ",(0,n.kt)("inlineCode",{parentName:"p"},"inheritHeaderColors")," property\nin ",(0,n.kt)("a",{parentName:"p",href:"./table#frameComponentsStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"frameComponentsStyle"))," to ",(0,n.kt)("em",{parentName:"p"},"false"),"."),(0,n.kt)("h4",{id:"example"},"Example"),(0,n.kt)(s.Z,{mdxType:"BrowserOnly"},(()=>a(1853).readdAutoNavToggle())),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{headerStyles:{default:{backgroundColor:"#efefef",borderBottom:"unset",fontWeight:"800",fontSize:"15px"},hoverColors:{backgroundColor:"#d2d2d2"}},content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table\n  headerStyles=\'{\n    "default": {\n      "backgroundColor": "#efefef",\n      "borderBottom": "unset",\n      "fontWeight": "800",\n      "fontSize": "15px"\n    },\n    "hoverColors": {\n      "backgroundColor": "#d2d2d2"\n    }\n  }\'\n></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  headerStyles=\'{\n    "default": {\n      "backgroundColor": "#efefef",\n      "borderBottom": "unset",\n      "fontWeight": "800",\n      "fontSize": "15px"\n    },\n    "hoverColors": {\n      "backgroundColor": "#d2d2d2"\n    }\n  }\'\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"isHeaderTextEditable"},(0,n.kt)("inlineCode",{parentName:"h3"},"isHeaderTextEditable")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Controls if cell text can be edited for header cells."),(0,n.kt)("h4",{id:"example-1"},"Example"),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{isHeaderTextEditable:!1,content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table isHeaderTextEditable="false"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  isHeaderTextEditable="false"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"allowduplicateheaders"},(0,n.kt)("inlineCode",{parentName:"h3"},"allowDuplicateHeaders")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Allows multiple columns to have the same header text. If set to ",(0,n.kt)("em",{parentName:"p"},"false")," and a duplicate is found the header text is defaulted to the value inside\n",(0,n.kt)("a",{parentName:"p",href:"./content#defaultText"},(0,n.kt)("inlineCode",{parentName:"a"},"defaultText")),"."),(0,n.kt)("h4",{id:"example-for-false"},"Example for false"),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{allowDuplicateHeaders:!1,content:[["Planet","Planet","Moons","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table allowDuplicateHeaders="false"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  allowDuplicateHeaders="false"\n  content=\'[\n    ["Planet", "Planet", "Moons", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"displayHeaderIcons"},(0,n.kt)("inlineCode",{parentName:"h3"},"displayHeaderIcons")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Displays an icon beside header text that represents the column type."),(0,n.kt)("h4",{id:"example-for-false-1"},"Example for false"),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{displayHeaderIcons:!1,content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table displayHeaderIcons="false"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  displayHeaderIcons="false"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"HeaderIconStyle"},(0,n.kt)("inlineCode",{parentName:"h3"},"headerIconStyle")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: {",(0,n.kt)("br",null),"\xa0","\xa0","\xa0","\xa0"," ",(0,n.kt)("inlineCode",{parentName:"li"},"filterColor?: string"),", ",(0,n.kt)("br",null),"\xa0","\xa0","\xa0","\xa0"," ",(0,n.kt)("inlineCode",{parentName:"li"},"scale?"),": {",(0,n.kt)("inlineCode",{parentName:"li"},"x?: number"),", ",(0,n.kt)("inlineCode",{parentName:"li"},"y?: number"),"}",(0,n.kt)("br",null),"\n}"),(0,n.kt)("li",{parentName:"ul"},"Default: {",(0,n.kt)("br",null),"\xa0","\xa0","\xa0","\xa0"," ",(0,n.kt)("em",{parentName:"li"},"iconFilterColor: 'brightness(0) saturate(100%) invert(34%) sepia(0%) saturate(1075%) hue-rotate(211deg) brightness(96%) contrast(90%)'"),", ",(0,n.kt)("br",null),"\xa0","\xa0","\xa0","\xa0"," ",(0,n.kt)("em",{parentName:"li"},"scale: {x: 1.1, y: 1.1}"),(0,n.kt)("br",null),"\n}")),(0,n.kt)("p",null,"Styling details for the column header icons. The color is set by using the ",(0,n.kt)("inlineCode",{parentName:"p"},"filterColor")," property which requires\na ",(0,n.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/CSS/filter"},"filter")," string (the reason for this is because the icon is an SVG element)\nthat can be retrieved using the ",(0,n.kt)("a",{parentName:"p",href:"https://cssfilterconverter.com/"},"cssfilterconverter")," tool . Use ",(0,n.kt)("inlineCode",{parentName:"p"},"scale")," to resize the icon dimensions."),(0,n.kt)("h4",{id:"example-2"},"Example"),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{headerIconStyle:{filterColor:"brightness(0) saturate(100%) invert(16%) sepia(85%) saturate(1892%) hue-rotate(210deg) brightness(88%) contrast(103%)",scale:{x:1.5,y:1.5}},content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table\n  headerIconStyle=\'{\n    "filterColor": "brightness(0) saturate(100%) invert(16%) sepia(85%) saturate(1892%) hue-rotate(210deg) brightness(88%) contrast(103%)",\n    "scale": {"x": 1.5, "y": 1.5}\n  }\'\n></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  headerIconStyle=\'{\n    "filterColor": "brightness(0) saturate(100%) invert(16%) sepia(85%) saturate(1892%) hue-rotate(210deg) brightness(88%) contrast(103%)",\n    "scale": {"x": 1.5, "y": 1.5}\n  }\'\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"stickyHeader"},(0,n.kt)("inlineCode",{parentName:"h3"},"stickyHeader")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"false")," or if ",(0,n.kt)("a",{parentName:"li",href:"./table#overflow"},(0,n.kt)("inlineCode",{parentName:"a"},"overflow"))," property is defined set to ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Header row will remain at the top of the table when there is overflow in the table or a parent element."),(0,n.kt)("h4",{id:"example-3"},"Example"),(0,n.kt)(o.Z,{customStyle:{maxHeight:"200px",overflow:"auto"},mdxType:"TableContainer"},(0,n.kt)(r.Z,{stickyHeader:!0,content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"97%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table stickyHeader="true"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<div style="maxHeight: 200px; overflow: auto">\n  <active-table\n    stickyHeader="true"\n    content=\'[\n      ["Planet", "Diameter", "Mass", "Moons", "Density"],\n      ["Earth", 12756, 5.97, 1, 5514],\n      ["Mars", 6792, 0.642, 2, 3934],\n      ["Jupiter", 142984, 1898, 79, 1326],\n      ["Saturn", 120536, 568, 82, 687],\n      ["Neptune", 49528, 102, 14, 1638]]\'\n    tableStyle=\'{"borderRadius":"2px"}\'\n  ></active-table>\n</div>\n')))),(0,n.kt)("admonition",{type:"note"},(0,n.kt)("p",{parentName:"admonition"},"The scrollbar in this example is located on the parent div element, however when using the ",(0,n.kt)("a",{parentName:"p",href:"./table#overflow"},(0,n.kt)("inlineCode",{parentName:"a"},"overflow"))," property\nit would be placed directly on the actual table component.")),(0,n.kt)(i.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"dataStartsAtHeader"},(0,n.kt)("inlineCode",{parentName:"h3"},"dataStartsAtHeader")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"false"))),(0,n.kt)("p",null,"Starts the index column count at header row and if ",(0,n.kt)("a",{parentName:"p",href:"./pagination"},(0,n.kt)("inlineCode",{parentName:"a"},"pagination"))," is used the header row will not be displayed in pages after the first."),(0,n.kt)("h4",{id:"example-4"},"Example"),(0,n.kt)(o.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{dataStartsAtHeader:"true",content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table dataStartsAtHeader="true"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  dataStartsAtHeader="true"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))))}f.isMDXComponent=!0}}]);