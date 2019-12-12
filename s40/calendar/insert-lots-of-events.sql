-- SQLite
insert into event (guid, name, description, dtlStart, dtlEnd, guidAgent, guidLocation)
select vv guid, vv name, 'descr of '||vv description, datetime(datetime(date('now'),'+'||10||' hours'),'-'||b4||' days') dtlStart, datetime(datetime(date('now'),'+'||16||' hours'),'-'||b4||' days') dtlEnd, 'agent1' guidAgent, 'loc1' guidLocation from
(
select s5.v*1+s4.v*4+s3.v*4*4+s2.v*4*4*4+s1.v*4*4*4*4+s0.v*4*4*4*4 b4, s0.v||s1.v||s2.v||s3.v||s4.v||s5.v vv
from 
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s0,
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s1,
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s2,
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s3,
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s4,
  (select '0' v union all select '1' v union all select '2' v union all select '3' v) s5
)
limit 200
;

