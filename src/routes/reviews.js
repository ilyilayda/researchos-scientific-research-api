const router=require('express').Router();const store=require('../lib/store');
const {validate,review,onlyFields}=require('../middleware/validate');
const fields=['projectId','taskId','reviewer','comment','status'];
function relations(req,res,next){const s=store.read();if(req.body.projectId&&!s.projects.some(p=>p.id===req.body.projectId))return res.status(400).json({error:'Unknown projectId.'});if(req.body.taskId){const t=s.tasks.find(t=>t.id===req.body.taskId);if(!t)return res.status(400).json({error:'Unknown taskId.'});const old=s.reviews.find(r=>r.id===req.params.id);if(t.projectId!==(req.body.projectId||old?.projectId))return res.status(400).json({error:'Review task must belong to review project.'});}next();}
router.get('/',(req,res)=>{let x=store.read().reviews;if(req.query.projectId)x=x.filter(r=>r.projectId===req.query.projectId);res.json({data:x});});
router.get('/:id',(req,res)=>{const x=store.read().reviews.find(r=>r.id===req.params.id);return x?res.json(x):res.status(404).json({error:'Review not found.'});});
router.post('/',validate(review),onlyFields(fields),relations,(req,res)=>res.status(201).json(store.create('reviews',{status:'open',...req.body})));
router.put('/:id',validate(review),onlyFields(fields),relations,(req,res)=>{const x=store.update('reviews',req.params.id,req.body);return x?res.json(x):res.status(404).json({error:'Review not found.'});});
router.delete('/:id',(req,res)=>{const x=store.remove('reviews',req.params.id);return x?res.json({message:'Review deleted.',data:x}):res.status(404).json({error:'Review not found.'});});
module.exports=router;
