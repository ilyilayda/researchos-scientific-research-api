const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'researchos-tests-'));
process.env.DATA_FILE=path.join(folder,'test-store.json');
const app=require('../src/app');
const server=app.listen(0);
after(()=>{server.close();fs.rmSync(folder,{recursive:true,force:true});});
async function request(method,route,body){const port=server.address().port;const r=await fetch(`http://127.0.0.1:${port}${route}`,{method,headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json()};}
test('health check',async()=>{const r=await request('GET','/api/health');assert.equal(r.status,200);assert.equal(r.body.status,'ok');});
test('task CRUD sequence + error conditions',async()=>{
 let r=await request('POST','/api/tasks',{title:'Test research workflow',projectId:'prj-001',type:'experiment',priority:'high'});assert.equal(r.status,201);const id=r.body.id;assert.ok(id);assert.equal(r.body.status,'todo');
 r=await request('GET','/api/tasks?type=experiment');assert.equal(r.status,200);assert.ok(r.body.data.some(x=>x.id===id));
 r=await request('GET','/api/tasks/'+id);assert.equal(r.status,200);assert.equal(r.body.title,'Test research workflow');
 r=await request('PUT','/api/tasks/'+id,{status:'completed'});assert.equal(r.status,200);assert.equal(r.body.status,'completed');
 r=await request('GET','/api/reports/summary');assert.equal(r.status,200);assert.ok(r.body.completedTasks>=1);
 r=await request('DELETE','/api/tasks/'+id);assert.equal(r.status,200);
 r=await request('GET','/api/tasks/'+id);assert.equal(r.status,404);
 r=await request('POST','/api/tasks',{projectId:'prj-001'});assert.equal(r.status,400);
 r=await request('POST','/api/tasks',{title:'Invalid project',projectId:'missing'});assert.equal(r.status,400);
 r=await request('GET','/api/tasks?page=0');assert.equal(r.status,400);
});
test('projects, members, reviews',async()=>{
 let r=await request('POST','/api/projects',{name:'Integration research study'});assert.equal(r.status,201);const pid=r.body.id;
 r=await request('POST','/api/members',{name:'Example Researcher',email:'researcher@example.org'});assert.equal(r.status,201);
 r=await request('POST','/api/reviews',{projectId:pid,comment:'Add an explanation.'});assert.equal(r.status,201);const reviewId=r.body.id;
 r=await request('DELETE','/api/projects/'+pid);assert.equal(r.status,409);
 r=await request('PUT','/api/reviews/'+reviewId,{status:'resolved'});assert.equal(r.status,200);
 r=await request('DELETE','/api/reviews/'+reviewId);assert.equal(r.status,200);
 r=await request('DELETE','/api/projects/'+pid);assert.equal(r.status,200);
});
