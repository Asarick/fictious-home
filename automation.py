import datetime

automation_rules = []

# Function to add new automation rule
def add_rule(rule):
    rule["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    automation_rules.append(rule)
    return {"message": "Rule added", "rule": rule}
