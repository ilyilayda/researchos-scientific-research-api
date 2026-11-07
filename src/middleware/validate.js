const allowedStatuses = ['todo','in_progress','in_review','completed'];
const allowedPriorities = ['low','medium','high','critical'];
const allowedTypes = ['literature','experiment','analysis','manuscript','revision','general'];
const allowedProjectStatuses = ['planning','active','on_hold','completed'];
const isObj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
function validate(schema) {
  return (req,res,next) => {
    if (!isObj(req.body)) return res.status(400).json({error:'JSON object body is required.'});
    const result = schema(req.body, req.method === 'POST');
    if (result) return res.status(400).json({error:result});
    next();
  };
}
function stringField(b,k,required=false) {
  if (required && (typeof b[k] !== 'string' || !b[k].trim())) return `${k} is required and must be a nonempty string.`;
  if (b[k] !== undefined && (typeof b[k] !== 'string' || !b[k].trim())) return `${k} must be a nonempty string.`;
  return null;
}
function enumeration(b,k,values) {return b[k] !== undefined && !values.includes(b[k]) ? `${k} must be one of: ${values.join(', ')}` : null;}
function dateField(b,k) { return b[k] != null && (typeof b[k] !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b[k]) || Number.isNaN(Date.parse(b[k]))) ? `${k} must be a valid YYYY-MM-DD date.` : null; }
const task = (b,required) => stringField(b,'title',required) || stringField(b,'description') || stringField(b,'assignee') || stringField(b,'projectId',required) || enumeration(b,'status',allowedStatuses) || enumeration(b,'priority',allowedPriorities) || enumeration(b,'type',allowedTypes) || dateField(b,'dueDate');
const project = (b,required) => stringField(b,'name',required) || stringField(b,'description') || stringField(b,'owner') || enumeration(b,'status',allowedProjectStatuses) || dateField(b,'deadline');
const member = (b,required) => stringField(b,'name',required) || stringField(b,'role') || (b.email !== undefined && (typeof b.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) ? 'email must be valid.' : null);
const review = (b,required) => stringField(b,'projectId',required) || stringField(b,'comment',required) || stringField(b,'reviewer') || stringField(b,'taskId') || enumeration(b,'status',['open','resolved']);
function onlyFields(fields) {return (req,res,next) => {const unknown=Object.keys(req.body).filter(k=>!fields.includes(k)); if(unknown.length) return res.status(400).json({error:`Unknown fields: ${unknown.join(', ')}`}); next();};}
module.exports={validate,task,project,member,review,onlyFields};
