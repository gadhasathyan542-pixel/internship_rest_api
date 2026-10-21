const express = require("express");
const cors = require("cors");
const db = require("./db");
const {validate,allowedDomains} = require("./validation");
const app = express(), PORT = process.env.PORT || 3000;
app.use(cors()); app.use(express.json({limit:"100kb"}));
const all = db.prepare("SELECT * FROM internships ORDER BY id DESC");
const byId = db.prepare("SELECT * FROM internships WHERE id=?");
const insert = db.prepare("INSERT INTO internships(title,company,domain,location,duration,stipend,description) VALUES(@title,@company,@domain,@location,@duration,@stipend,@description)");
const update = db.prepare("UPDATE internships SET title=@title,company=@company,domain=@domain,location=@location,duration=@duration,stipend=@stipend,description=@description WHERE id=@id");
function fail(res,status,code,message,details){const error={code,message};if(details)error.details=details;return res.status(status).json({success:false,error});}
app.get("/",(req,res)=>res.json({name:"Internship Records API",endpoints:["GET /api/health","GET /api/domains","GET /api/internships?page=1&limit=5","GET /api/internships/:id","POST /api/internships","PUT /api/internships/:id","DELETE /api/internships/:id"]}));
app.get("/api/health",(req,res)=>res.json({success:true,data:{status:"ok"}}));
app.get("/api/domains",(req,res)=>res.json({success:true,data:allowedDomains}));
app.get("/api/internships",(req,res)=>{
 const page=Number.parseInt(req.query.page||"1",10), limit=Number.parseInt(req.query.limit||"5",10);
 if(!Number.isInteger(page)||page<1)return fail(res,400,"INVALID_PAGE","page must be an integer >= 1.");
 if(!Number.isInteger(limit)||limit<1||limit>100)return fail(res,400,"INVALID_LIMIT","limit must be between 1 and 100.");
 const domain=typeof req.query.domain==="string"?req.query.domain:"", search=typeof req.query.search==="string"?req.query.search.trim().toLowerCase():"";
 if(domain&&domain!=="all"&&!allowedDomains.includes(domain))return fail(res,400,"INVALID_DOMAIN","Choose a domain from GET /api/domains.");
 let rows=all.all();
 if(domain&&domain!=="all")rows=rows.filter(x=>x.domain===domain);
 if(search)rows=rows.filter(x=>[x.title,x.company,x.domain,x.description,x.location].some(v=>v.toLowerCase().includes(search)));
 const total=rows.length,start=(page-1)*limit;
 res.json({success:true,data:rows.slice(start,start+limit),pagination:{page,limit,total,totalPages:Math.ceil(total/limit),hasNextPage:start+limit<total,hasPreviousPage:page>1}});
});
app.get("/api/internships/:id",(req,res)=>{
 const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return fail(res,400,"INVALID_ID","id must be a positive integer.");
 const row=byId.get(id);if(!row)return fail(res,404,"NOT_FOUND","Internship record not found.");
 res.json({success:true,data:row});
});
app.post("/api/internships",(req,res)=>{
 const v=validate(req.body);if(!v.valid)return fail(res,400,"VALIDATION_ERROR","Please correct the submitted fields.",v.errors);
 const x={title:req.body.title.trim(),company:req.body.company.trim(),domain:req.body.domain,location:(req.body.location||"Remote").trim(),duration:req.body.duration.trim(),stipend:(req.body.stipend||"Not specified").trim(),description:req.body.description.trim()};
 const result=insert.run(x), row=byId.get(result.lastInsertRowid);
 res.location(`/api/internships/${row.id}`).status(201).json({success:true,data:row});
});
app.put("/api/internships/:id",(req,res)=>{
 const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return fail(res,400,"INVALID_ID","id must be a positive integer.");
 const current=byId.get(id);if(!current)return fail(res,404,"NOT_FOUND","Internship record not found.");
 const v=validate(req.body,true);if(!v.valid)return fail(res,400,"VALIDATION_ERROR","Please correct the submitted fields.",v.errors);
 const x={...current,...req.body,id};
 for(const f of ["title","company","location","duration","stipend","description"])x[f]=String(x[f]).trim();
 if(!allowedDomains.includes(x.domain))return fail(res,400,"INVALID_DOMAIN","Choose a domain from GET /api/domains.");
 update.run(x);res.json({success:true,data:byId.get(id)});
});
app.delete("/api/internships/:id",(req,res)=>{
 const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return fail(res,400,"INVALID_ID","id must be a positive integer.");
 const result=db.prepare("DELETE FROM internships WHERE id=?").run(id);
 if(!result.changes)return fail(res,404,"NOT_FOUND","Internship record not found.");
 res.json({success:true,data:{id,deleted:true}});
});
app.use((err,req,res,next)=>{if(err instanceof SyntaxError&&"body" in err)return fail(res,400,"INVALID_JSON","Request body must contain valid JSON.");console.error(err);return fail(res,500,"INTERNAL_ERROR","Unexpected server error.");});
app.use((req,res)=>fail(res,404,"ROUTE_NOT_FOUND","API route not found. Visit / for available endpoints."));
app.listen(PORT,()=>console.log(`Internship API running at http://localhost:${PORT}`));
