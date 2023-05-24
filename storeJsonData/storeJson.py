import json

numbers = [10, 20, 30, 70, 191, 23]  
filename = 'numbers.json'          
with open(filename, 'w') as file_object:  
 json.dump(numbers, file_object)  
