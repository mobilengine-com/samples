-- SQLite
drop table if EXISTS agent;
create table agent(guid text PRIMARY KEY, name text, color text);

insert into agent(guid, name, color) values 
    ('agent1', 'Józsi', 'FF0000'), 
    ('agent2', 'Sanyi', '00FF00'),
    ('agent3', 'Jen', '0000FF');

drop table if EXISTS location;
create table location(guid text PRIMARY KEY, name text, lat float, long float);

insert into location(guid, name, lat, long) values 
    ('loc1', 'Bp office', 47.501353, 19.056423), 
    ('loc2', 'Miskolc office', 48.093855, 20.785912),
    ('loc3', 'Boston office', 42.350378, -71.056916);

drop table if EXISTS event;
create table event(
    guid text PRIMARY KEY, 
    name text,
    description text,
    dtlStart text,
    dtlEnd text,
    guidAgent text,
    guidLocation text
);

insert into event(guid, name, description, dtlStart, dtlEnd, guidAgent, guidLocation)
values
('event1', 'event 1', 'this is the description of event1', '2019-11-15 09:00:00', '2019-11-15 10:30:00', 'agent1', 'loc1'),
('event2', 'event 2', 'this is the description of event2', '2019-11-15 08:00:00', '2019-11-15 11:40:00', 'agent2', 'loc1'),
('event3', 'event 3', 'this is the description of event1', '2019-11-15 13:00:00', '2019-11-15 14:30:00', 'agent1', 'loc2'),
('event4', 'event 4', 'this is the description of event2', '2019-11-15 14:10:00', '2019-11-15 15:40:00', 'agent2', 'loc2')
;

select * from event;