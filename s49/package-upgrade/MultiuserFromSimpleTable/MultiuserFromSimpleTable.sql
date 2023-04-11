INSERT INTO baseWithMultiuser (data1,data2) 
  (SELECT data1,data2
  from baseWithMultiuser_old);
INSERT INTO baseWithMultiuser_multiuser (RowIdParent, data3) (Select b.RowId, a.user FROM baseWithMultiuser_old b Join (SELECT * FROM userhelp) a ON b.data1 = a.favorit)