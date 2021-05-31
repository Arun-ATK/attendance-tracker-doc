CREATE FUNCTION ispresent_update()
RETURNS trigger AS $ispresent_update$
DECLARE
    new_threshold_val   INTEGER;
    GRACE_TIME          INTEGER := 5;

BEGIN
    new_threshold_val = NEW.DURATION * NEW.THRESHOLD_PERCENT;
    new_threshold_val = (new_threshold_val / 100) - GRACE_TIME;

    IF(TG_OP = 'UPDATE') THEN
        UPDATE ATTENDS
        SET ISPRESENT = CASE 
            WHEN DURATION >= new_threshold_val THEN TRUE
            ELSE FALSE 
        END
        WHERE LECTURE_ID = NEW.LECTURE_ID;
    END IF;

    RETURN NULL;
END;
$ispresent_update$ LANGUAGE plpgsql;