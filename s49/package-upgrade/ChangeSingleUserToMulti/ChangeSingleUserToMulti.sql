INSERT INTO baseWithMultiuser (data1,data2) 
  (SELECT data1,data2
  from baseWithMultiuser_old);
INSERT INTO baseWithMultiuser_multiuser (RowIdParent, data3) (SELECT RowId, data3 FROM baseWithMultiuser_old);