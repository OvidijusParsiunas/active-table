"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[651],{5162:(e,t,a)=>{a.d(t,{Z:()=>i});var l=a(7294),n=a(6010);const r={tabItem:"tabItem_Ymn6"};function i(e){let{children:t,hidden:a,className:i}=e;return l.createElement("div",{role:"tabpanel",className:(0,n.Z)(r.tabItem,i),hidden:a},t)}},4866:(e,t,a)=>{a.d(t,{Z:()=>T});var l=a(7462),n=a(7294),r=a(6010),i=a(2466),o=a(6550),s=a(1980),d=a(7392),u=a(12);function p(e){return function(e){return n.Children.map(e,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:a,attributes:l,default:n}}=e;return{value:t,label:a,attributes:l,default:n}}))}function m(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??p(a);return function(e){const t=(0,d.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function c(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function b(e){let{queryString:t=!1,groupId:a}=e;const l=(0,o.k6)(),r=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,s._X)(r),(0,n.useCallback)((e=>{if(!r)return;const t=new URLSearchParams(l.location.search);t.set(r,e),l.replace({...l.location,search:t.toString()})}),[r,l])]}function k(e){const{defaultValue:t,queryString:a=!1,groupId:l}=e,r=m(e),[i,o]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!c({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const l=a.find((e=>e.default))??a[0];if(!l)throw new Error("Unexpected error: 0 tabValues");return l.value}({defaultValue:t,tabValues:r}))),[s,d]=b({queryString:a,groupId:l}),[p,k]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[l,r]=(0,u.Nk)(a);return[l,(0,n.useCallback)((e=>{a&&r.set(e)}),[a,r])]}({groupId:l}),h=(()=>{const e=s??p;return c({value:e,tabValues:r})?e:null})();(0,n.useLayoutEffect)((()=>{h&&o(h)}),[h]);return{selectedValue:i,selectValue:(0,n.useCallback)((e=>{if(!c({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),k(e)}),[d,k,r]),tabValues:r}}var h=a(2389);const x={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};function f(e){let{className:t,block:a,selectedValue:o,selectValue:s,tabValues:d}=e;const u=[],{blockElementScrollPositionUntilNextRender:p}=(0,i.o5)(),m=e=>{const t=e.currentTarget,a=u.indexOf(t),l=d[a].value;l!==o&&(p(t),s(l))},c=e=>{let t=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":{const a=u.indexOf(e.currentTarget)+1;t=u[a]??u[0];break}case"ArrowLeft":{const a=u.indexOf(e.currentTarget)-1;t=u[a]??u[u.length-1];break}}t?.focus()};return n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":a},t)},d.map((e=>{let{value:t,label:a,attributes:i}=e;return n.createElement("li",(0,l.Z)({role:"tab",tabIndex:o===t?0:-1,"aria-selected":o===t,key:t,ref:e=>u.push(e),onKeyDown:c,onClick:m},i,{className:(0,r.Z)("tabs__item",x.tabItem,i?.className,{"tabs__item--active":o===t})}),a??t)})))}function y(e){let{lazy:t,children:a,selectedValue:l}=e;if(a=Array.isArray(a)?a:[a],t){const e=a.find((e=>e.props.value===l));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return n.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==l}))))}function v(e){const t=k(e);return n.createElement("div",{className:(0,r.Z)("tabs-container",x.tabList)},n.createElement(f,(0,l.Z)({},e,t)),n.createElement(y,(0,l.Z)({},e,t)))}function T(e){const t=(0,h.Z)();return n.createElement(v,(0,l.Z)({key:String(t)},e))}},9814:(e,t,a)=>{a.d(t,{Z:()=>n});var l=a(7294);function n(){return l.createElement("div",{style:{height:"1px"}})}},1853:(e,t,a)=>{function l(e){window.scrollY>0?e.style.boxShadow="0 1px 2px 0 rgb(0 0 0 / 10%)":e.style.boxShadow="unset"}function n(){setTimeout((()=>{window.removeEventListener("scroll",window.toggleNavOnScroll);const e=document.getElementsByClassName("navbar--fixed-top");if(e[0]){const t=e[0];l(t),window.toggleNavOnScroll=l.bind(this,t),window.addEventListener("scroll",window.toggleNavOnScroll)}}),2)}function r(){setTimeout((()=>{const e=document.querySelectorAll(".plugin-pages > body > #__docusaurus > nav")?.[0];e&&e.classList.add("fade-in")}),2)}a.r(t),a.d(t,{fadeIn:()=>r,readdAutoNavToggle:()=>n})},9272:(e,t,a)=>{a.d(t,{Z:()=>r,v:()=>n});var l=a(7294);function n(e){return e?.children[0]?.children[0]}function r(e){let{children:t}=e;return l.createElement("div",{className:"documentation-example-container"},l.createElement("div",null,t))}},3432:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>b,contentTitle:()=>m,default:()=>f,frontMatter:()=>p,metadata:()=>c,toc:()=>k});var l=a(7462),n=(a(7294),a(3905)),r=a(4336),i=a(9272),o=a(9814),s=a(1262),d=a(5162),u=a(4866);const p={sidebar_position:4},m="Content",c={unversionedId:"content",id:"content",title:"Content",description:"Properties related to content cells displayed in the table.",source:"@site/docs/content.mdx",sourceDirName:".",slug:"/content",permalink:"/docs/content",draft:!1,editUrl:"https://github.com/OvidijusParsiunas/active-table/tree/main/website/docs/content.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"defaultSidebar",previous:{title:"Table",permalink:"/docs/table"},next:{title:"Header",permalink:"/docs/header"}},b={},k=[{value:"<code>content</code>",id:"content-1",level:3},{value:"Example",id:"example",level:4},{value:"<code>defaultText</code>",id:"defaultText",level:3},{value:"Example",id:"example-1",level:4},{value:"<code>isDefaultTextRemovable</code>",id:"isDefaultTextRemovable",level:3},{value:"Example",id:"example-2",level:4},{value:"<code>cellStyle</code>",id:"cellStyle",level:3},{value:"Example",id:"example-3",level:4},{value:"<code>isCellTextEditable</code>",id:"isCellTextEditable",level:3},{value:"Example",id:"example-4",level:4},{value:"<code>spellCheck</code>",id:"spellcheck",level:3},{value:"Example",id:"example-5",level:4}],h={toc:k},x="wrapper";function f(e){let{components:t,...p}=e;return(0,n.kt)(x,(0,l.Z)({},h,p,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"content"},"Content"),(0,n.kt)("p",null,"Properties related to content cells displayed in the table."),(0,n.kt)("h3",{id:"content-1"},(0,n.kt)("inlineCode",{parentName:"h3"},"content")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"(string|number)[][]"))),(0,n.kt)("p",null,"Header and data text to be displayed in the table. First array represents the header row, following arrays represent data rows."),(0,n.kt)("h4",{id:"example"},"Example"),(0,n.kt)(s.Z,{mdxType:"BrowserOnly"},(()=>a(1853).readdAutoNavToggle())),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(o.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"defaultText"},(0,n.kt)("inlineCode",{parentName:"h3"},"defaultText")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"string|number")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},'""'))),(0,n.kt)("p",null,"Replacement text that is displayed when cell has no text or its type validation has failed. ",(0,n.kt)("br",null)),(0,n.kt)("h4",{id:"example-1"},"Example"),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{defaultText:"-",content:[["Planet","Diameter","Mass","Moons","Density"],["","",5.97,1,5514],["","",.642,2,3934],["","",1898,79,1326],["","",568,82,687],["","",102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table defaultText="-"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  defaultText="-"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["", "", 5.97, 1, 5514],\n    ["", "", 0.642, 2, 3934],\n    ["", "", 1898, 79, 1326],\n    ["", "", 568, 82, 687],\n    ["", "", 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(o.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"isDefaultTextRemovable"},(0,n.kt)("inlineCode",{parentName:"h3"},"isDefaultTextRemovable")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Removes default text when a cell containg one is focused."),(0,n.kt)("h4",{id:"example-2"},"Example"),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{defaultText:"Click",isDefaultTextRemovable:"true",content:[["Planet","Diameter","Mass","Moons","Density"],["","",5.97,1,5514],["","",.642,2,3934],["","",1898,79,1326],["","",568,82,687],["","",102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table defaultText="Click" isDefaultTextRemovable="true"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  defaultText="Click"\n  isDefaultTextRemovable="true"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["", "", 5.97, 1, 5514],\n    ["", "", 0.642, 2, 3934],\n    ["", "", 1898, 79, 1326],\n    ["", "", 568, 82, 687],\n    ["", "", 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(o.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"cellStyle"},(0,n.kt)("inlineCode",{parentName:"h3"},"cellStyle")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: { ",(0,n.kt)("inlineCode",{parentName:"li"},"CSSStyle")," & ",(0,n.kt)("inlineCode",{parentName:"li"},"!minWidth")," & ",(0,n.kt)("inlineCode",{parentName:"li"},"!maxWidth")," & ",(0,n.kt)("inlineCode",{parentName:"li"},"!height")," & ",(0,n.kt)("inlineCode",{parentName:"li"},"!minHeight")," & ",(0,n.kt)("inlineCode",{parentName:"li"},"!maxHeight")," }")),(0,n.kt)("p",null,"Defines the default style for table cells. ",(0,n.kt)("br",null),"\nThis object contais all ",(0,n.kt)("inlineCode",{parentName:"p"},"CSSStyle")," properties except ",(0,n.kt)("inlineCode",{parentName:"p"},"minWidth"),", ",(0,n.kt)("inlineCode",{parentName:"p"},"maxWidth"),", ",(0,n.kt)("inlineCode",{parentName:"p"},"height"),", ",(0,n.kt)("inlineCode",{parentName:"p"},"minHeight")," and ",(0,n.kt)("inlineCode",{parentName:"p"},"maxHeight"),". ",(0,n.kt)("br",null),"\nThe ",(0,n.kt)("inlineCode",{parentName:"p"},"width")," property supports ",(0,n.kt)("em",{parentName:"p"},"px")," and ",(0,n.kt)("em",{parentName:"p"},"%")," measurements, however when using ",(0,n.kt)("em",{parentName:"p"},"%")," - the ",(0,n.kt)("a",{parentName:"p",href:"./table#tableStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"tableStyle"))," object should have its ",(0,n.kt)("inlineCode",{parentName:"p"},"width")," property\nset as otherwise the cells will not be able to calculate a relative width. Additionally, when ",(0,n.kt)("a",{parentName:"p",href:"#cellStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"cellStyle"))," - ",(0,n.kt)("inlineCode",{parentName:"p"},"width")," and\n",(0,n.kt)("a",{parentName:"p",href:"./table#tableStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"tableStyle"))," - ",(0,n.kt)("inlineCode",{parentName:"p"},"width")," are defined and ",(0,n.kt)("a",{parentName:"p",href:"./column#isColumnResizable"},(0,n.kt)("inlineCode",{parentName:"a"},"isColumnResizable"))," is set to ",(0,n.kt)("em",{parentName:"p"},"true"),", the ",(0,n.kt)("a",{parentName:"p",href:"#cellStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"cellStyle"))," - ",(0,n.kt)("inlineCode",{parentName:"p"},"width"),"\nwill be overriden to reach the set table ",(0,n.kt)("inlineCode",{parentName:"p"},"width"),", hence to prevent this make sure to set ",(0,n.kt)("a",{parentName:"p",href:"./column#isColumnResizable"},(0,n.kt)("inlineCode",{parentName:"a"},"isColumnResizable"))," to ",(0,n.kt)("em",{parentName:"p"},"false"),"."),(0,n.kt)("h4",{id:"example-3"},"Example"),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{cellStyle:{borderBottom:"1px solid black",borderRight:"1px solid black",backgroundColor:"#fafafa"},content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table\n  cellStyle=\'{"borderBottom": "1px solid black", "borderRight": "1px solid black", "backgroundColor": "#fafafa"}\'\n></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  cellStyle=\'{"borderBottom": "1px solid black", "borderRight": "1px solid black", "backgroundColor": "#fafafa"}\'\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"If you wish to set the header cell style please use the ",(0,n.kt)("a",{parentName:"p",href:"./header#headerStyles"},(0,n.kt)("inlineCode",{parentName:"a"},"headerStyles"))," property and the style of the frame components (index, add new column,\nnew row) can be set via the ",(0,n.kt)("a",{parentName:"p",href:"./table#frameComponentsStyle"},(0,n.kt)("inlineCode",{parentName:"a"},"frameComponentsStyle"))," property.")),(0,n.kt)(o.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"isCellTextEditable"},(0,n.kt)("inlineCode",{parentName:"h3"},"isCellTextEditable")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"true"))),(0,n.kt)("p",null,"Controls if cell text can be edited for both data and header cells. This property is superseded by ",(0,n.kt)("a",{parentName:"p",href:"./header#isHeaderTextEditable"},(0,n.kt)("inlineCode",{parentName:"a"},"isHeaderTextEditable"))," for header cells."),(0,n.kt)("h4",{id:"example-4"},"Example"),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{isCellTextEditable:!1,content:[["Planet","Diameter","Mass","Moons","Density"],["Earth",12756,5.97,1,5514],["Mars",6792,.642,2,3934],["Jupiter",142984,1898,79,1326],["Saturn",120536,568,82,687],["Neptune",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table isCellTextEditable="false"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  isCellTextEditable="false"\n  content=\'[\n    ["Planet", "Diameter", "Mass", "Moons", "Density"],\n    ["Earth", 12756, 5.97, 1, 5514],\n    ["Mars", 6792, 0.642, 2, 3934],\n    ["Jupiter", 142984, 1898, 79, 1326],\n    ["Saturn", 120536, 568, 82, 687],\n    ["Neptune", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)(o.Z,{mdxType:"LineBreak"}),(0,n.kt)("h3",{id:"spellcheck"},(0,n.kt)("inlineCode",{parentName:"h3"},"spellCheck")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Type: ",(0,n.kt)("inlineCode",{parentName:"li"},"boolean")),(0,n.kt)("li",{parentName:"ul"},"Default: ",(0,n.kt)("em",{parentName:"li"},"false"))),(0,n.kt)("p",null,"Checks table text for spelling mistakes (based on the browser's language settings) and if found displays a curly red line under the errors."),(0,n.kt)("h4",{id:"example-5"},"Example"),(0,n.kt)(i.Z,{mdxType:"TableContainer"},(0,n.kt)(r.Z,{spellCheck:!0,content:[["Planetasdasd","Diamasdasdeter","Masssdfsdf","Mooffns","Denssdsdfdsfity"],["asdasdasd",12756,5.97,1,5514],["Msadasdars",6792,.642,2,3934],["Jupitar",142984,1898,79,1326],["asudhasd",120536,568,82,687],["saiuhfjduidshfuis",49528,102,14,1638]],tableStyle:{width:"100%",boxShadow:"rgb(172 172 172 / 17%) 0px 0.5px 1px 0px",borderRadius:"2px"},mdxType:"ActiveTable"})),(0,n.kt)(u.Z,{mdxType:"Tabs"},(0,n.kt)(d.Z,{value:"js",label:"Sample code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<active-table spellCheck="true"></active-table>\n'))),(0,n.kt)(d.Z,{value:"py",label:"Full code",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'\x3c!-- This example is for Vanilla JS and should be tailored to your framework (see Examples) --\x3e\n\n<active-table\n  spellCheck="true"\n  content=\'[\n    ["Planetasdasd", "Diamasdasdeter", "Masssdfsdf", "Mooffns", "Denssdsdfdsfity"],\n    ["asdasdasd", 12756, 5.97, 1, 5514],\n    ["Msadasdars", 6792, 0.642, 2, 3934],\n    ["Jupitar", 142984, 1898, 79, 1326],\n    ["asudhasd", 120536, 568, 82, 687],\n    ["saiuhfjduidshfuis", 49528, 102, 14, 1638]]\'\n  tableStyle=\'{"borderRadius":"2px"}\'\n></active-table>\n')))),(0,n.kt)("admonition",{type:"caution"},(0,n.kt)("p",{parentName:"admonition"},"This is a browser dependent feature that may be handled differently depending on the browser you are using.")))}f.isMDXComponent=!0}}]);