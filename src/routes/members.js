const router=require('express').Router();const store=require('../lib/store');
const {validate,member,onlyFields}=require('../middleware/validate');
const fields=['name','email','role'];
router.get('/',(req,res)=>res.json({data:store.read().members}));
router.get('/:id',(req,res)=>{const x=store.read().members.find(x=>x.id===req.params.id);return x?res.json(x):res.status(404).json({error:'Member not found.'});});
router.post('/',validate(member),onlyFields(fields),(req,res)=>res.status(201).json(store.create('members',req.body)));
router.put('/:id',validate(member),onlyFields(fields),(req,res)=>{const x=store.update('members',req.params.id,req.body);return x?res.json(x):res.status(404).json({error:'Member not found.'});});
router.delete('/:id',(req,res)=>{const x=store.remove('members',req.params.id);return x?res.json({message:'Member deleted.',data:x}):res.status(404).json({error:'Member not found.'});});
module.exports=router;
