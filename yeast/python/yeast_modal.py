import pandas as pd
import sqlite3
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_colwidth', -1)

def modal(request):
    feature_name = request.POST.get('feature_name').split('%')

    feature1 = feature_name[0]
    name1 = feature_name[1]

    feature2 = feature_name[2]
    name2 = feature_name[3]

    try:
        connect = sqlite3.connect('/home/chunlin/Django/chunlin_project/db.sqlite3')
        db_cursor = connect.cursor()

        select = """
            SELECT SystematicName FROM %s_1_to_10 WHERE `%s(Queried)` IN ('%s');
        """%(feature1, feature1, name1)
        db_cursor.execute(select)
        sys_name1 = db_cursor.fetchall()
        # print('---------------')
        # print(sys_name1)
        sys_name1_set = set(eval(sys_name1[0][0]))

        # print('---------------')

        select = """
            SELECT SystematicName FROM %s_1_to_10 WHERE `%s(Queried)` IN ('%s');
        """%(feature2, feature2, name2)
        db_cursor.execute(select )
        sys_name2 = db_cursor.fetchall()
        # print('----')
        # print(sys_name2)
        sys_name2_set = set(eval(sys_name2[0][0]))
        intersection = str(tuple(sys_name1_set.intersection(sys_name2_set)))
        # print(intersection)
        # print(feature1)
        '''-------------------------依照主要的feature取出證據檔------------------'''
        if feature2 == 'Physical_Interaction':
            select = """
                SELECT * FROM %s_evidence WHERE `SystematicName(Bait)` IN %s OR `SystematicName(Hit)` IN %s
            """%(feature2, intersection,intersection)
            evidence_table = pd.read_sql(select , connect)


        elif feature2 == 'Genetic_Interaction':
            select = """
                SELECT * FROM %s_evidence WHERE `SystematicName(Bait)` IN %s OR `SystematicName(Hit)` IN %s
            """%(feature2, intersection,intersection)
            evidence_table = pd.read_sql(select , connect)

        else:
            select = """
                SELECT * FROM %s_evidence WHERE SystematicName IN %s
            """%(feature2, intersection)
            evidence_table = pd.read_sql(select , connect)
    finally:
        connect.close()
    evidence_table = evidence_table.to_html(index= None, classes="table table-striped table-bordered",escape=False)
    evidence_table = evidence_table.replace('table', 'table id="evidence_table"', 1)
    # print(evidence_table)
    # evidence = evidence_table.to_json(orient="split")
    # print(evidence)

    return evidence_table