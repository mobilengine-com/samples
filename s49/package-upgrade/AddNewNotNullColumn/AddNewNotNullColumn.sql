INSERT INTO base (data1, data2, mail) (SELECT data1, data2, 'Dear Customer

That was a test text.

Best regards,
Test

www.tester.com' FROM base_old);