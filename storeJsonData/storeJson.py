import json

numbers = [10, 20, 30, 70, 191, 23]  #create a set of numbers
filename = 'numbers.json'          #use the file extension .json
with open(filename, 'w') as file_object:  #open the file in write mode
 json.dump(numbers, file_object)   # json.dump() function to stores the set of numbers in numbers.json file