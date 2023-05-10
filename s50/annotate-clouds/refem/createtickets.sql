delete from ticket;
INSERT INTO ticket(guid, guidPoint, category,  status, description)
  WITH RECURSIVE
    cte(x) AS (
       SELECT random()
       UNION ALL
       SELECT random()
         FROM cte
        LIMIT 4000
  )
SELECT lower(hex(randomblob(16))), '123', 'viz', 1, 'ez egy ticket #'||x FROM cte;