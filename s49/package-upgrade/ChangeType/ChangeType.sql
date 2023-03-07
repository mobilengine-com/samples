UPDATE base
   SET data2=(
    SELECT LENGTH(old.data2)
    FROM base_old old
    WHERE base.RowId=old.RowId
    )