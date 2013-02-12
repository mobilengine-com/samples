DROP TABLE IF EXISTS tmplog;
CREATE TEMPORARY TABLE IF NOT EXISTS tmplog (msg VARCHAR(512)) ENGINE = MEMORY;

DROP PROCEDURE IF EXISTS PatchReftabsEgyeb;
DELIMITER $$
CREATE PROCEDURE PatchReftabsEgyeb()
BEGIN
  DECLARE tabn VARCHAR(30);
  DECLARE coln VARCHAR(50);
  DECLARE cur1 CURSOR FOR 
    SELECT DISTINCT CONCAT_WS('_', c.TablePrefix, r.TableName) 
    FROM ReferenceTableList r 
    JOIN CompanyList c ON r.CompanyId=c.Id  
    WHERE r.TableName='egyeb' AND r.isDeleted=0; 

  OPEN cur1;
  read_loop: LOOP
    FETCH cur1 INTO tabn;
    
    SET coln = NULL;
    SELECT COLUMN_NAME INTO coln
    FROM information_schema.COLUMNS 
    WHERE table_schema=SCHEMA()
    AND column_name LIKE 'egyeb%'
    AND TABLE_NAME = tabn
    AND DATA_TYPE = 'bit';	
 
    IF coln IS NULL THEN
      INSERT INTO tmplog VALUES(CONCAT(tabn, ': No column to patch.'));
    ELSE    
      SET @q = CONCAT(CONCAT ('ALTER TABLE ', tabn), CONCAT(' MODIFY COLUMN ', CONCAT(coln, ' INT')));
        
      INSERT INTO tmplog VALUES(@q);
      PREPARE stmt FROM @q;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
     END IF;
  END LOOP;
CLOSE cur1;
SELECT * FROM tmplog;
END$$
DELIMITER ;

CALL PatchReftabsEgyeb();
DROP PROCEDURE PatchReftabsEgyeb;
SELECT * FROM tmplog;
DROP TABLE IF EXISTS tmplog;