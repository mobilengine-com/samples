INSERT INTO baseWithMultiuser (data1, data2) VALUES ("asd", "asd");
INSERT INTO baseWithMultiuser_multiuser (RowIdParent, data3) (SELECT RowId, "Körte" FROM baseWithMultiuser WHERE data1 = "asd");
INSERT INTO baseWithMultiuser_multiuser (RowIdParent, data3) (SELECT RowId, "Dinye" FROM baseWithMultiuser WHERE data1 = "asd");