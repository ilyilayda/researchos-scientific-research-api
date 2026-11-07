const router = require('express').Router();
const store = require('../lib/store');
const { validate, task, onlyFields } = require('../middleware/validate');
const fields = ['title','description','projectId','assignee','status','priority','type','dueDate'];
function existingProject(req,res,next) {
  const s=store.read();
  if (req.body.projectId && !s.projects.some(p=>p.id===req.body.projectId)) return res.status(400).json({error:'projectId does not reference an existing project.'});
  next();
}
router.get('/', (req,res)=> {
  const {status,priority,type,projectId,assignee,search,sort='createdAt',order='desc'}=req.query;
  let list=store.read().tasks;
  for(const [k,v] of Object.entries({status,priority,type,projectId,assignee})) if(v) list=list.filter(t=>t[k]===v);
  if(search) list=list.filter(t=>`${t.title} ${t.description||''}`.toLowerCase().includes(String(search).toLowerCase()));
  if(!['createdAt','dueDate','priority','title'].includes(sort)) return res.status(400).json({error:'Invalid sort field.'});
  if(!['asc','desc'].includes(order)) return res.status(400).json({error:'Invalid order.'});
  list=[...list].sort((a,b)=>String(a[sort]||'').localeCompare(String(b[sort]||''))*(order==='asc'?1:-1));
  const page=Number(req.query.page||1), limit=Number(req.query.limit||50);
  if(!Number.isInteger(page)||page<1||!Number.isInteger(limit)||limit<1||limit>100) return res.status(400).json({error:'page must be >= 1, limit must be between 1 and 100.'});
  res.json({data:list.slice((page-1)*limit,page*limit),pagination:{page,limit,total:list.length,totalPages:Math.ceil(list.length/limit)}});
});
router.get('/:id',(req,res)=>{const item=store.read().tasks.find(t=>t.id===req.params.id);return item?res.json(item):res.status(404).json({error:'Task not found.'});});
router.post('/',validate(task),onlyFields(fields),existingProject,(req,res)=>res.status(201).json(store.create('tasks',{status:'todo',priority:'medium',type:'general',...req.body})));
router.put('/:id',validate(task),onlyFields(fields),existingProject,(req,res)=>{
 const item=store.update('tasks',req.params.id,req.body);
 return item?res.json(item):res.status(404).json({error:'Task not found.'});
});
router.delete('/:id',(req,res)=>{
 const item=store.remove('tasks',req.params.id);
 if(!item) return res.status(404).json({error:'Task not found.'});
 const state=store.read();state.reviews=state.reviews.map(r=>r.taskId===item.id?{...r,taskId:null}:r);store.save(state);
 return res.json({message:'Task deleted.',data:item});
});
module.exports=router;
