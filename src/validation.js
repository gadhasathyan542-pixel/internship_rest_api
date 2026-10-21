const allowedDomains = ["Development","Design","Data & AI","Marketing","Cybersecurity","Business"];
function validate(body, partial = false) {
 const errors = [], required = ["title","company","domain","duration","description"];
 const fields = ["title","company","domain","location","duration","stipend","description"];
 if (!body || typeof body !== "object" || Array.isArray(body)) return {valid:false,errors:["Body must be a JSON object."]};
 for (const f of (partial ? fields.filter(x => Object.hasOwn(body,x)) : required)) {
  if (typeof body[f] !== "string" || !body[f].trim()) errors.push(`${f} must be a non-empty string.`);
  if (typeof body[f] === "string" && body[f].length > 5000) errors.push(`${f} must be 5000 characters or fewer.`);
 }
 if (body.domain !== undefined && !allowedDomains.includes(body.domain)) errors.push(`domain must be one of: ${allowedDomains.join(", ")}.`);
 return {valid:errors.length===0,errors};
}
module.exports = {validate,allowedDomains};
