export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
}

export const defaultData: Person[] = [
  {
    "firstName": "Queenie",
    "lastName": "Price",
    "age": 32,
    "visits": 708,
    "progress": 47,
    "status": "complicated"
  },
  {
    "firstName": "Pearl",
    "lastName": "Lubowitz",
    "age": 1,
    "visits": 273,
    "progress": 52,
    "status": "relationship"
  },
  {
    "firstName": "Jessie",
    "lastName": "Schinner",
    "age": 35,
    "visits": 737,
    "progress": 59,
    "status": "single"
  },
  {
    "firstName": "Sophie",
    "lastName": "Ward",
    "age": 8,
    "visits": 118,
    "progress": 67,
    "status": "complicated"
  },
  {
    "firstName": "Salvatore",
    "lastName": "Little",
    "age": 30,
    "visits": 777,
    "progress": 13,
    "status": "complicated"
  },
  {
    "firstName": "Lucio",
    "lastName": "Ankunding",
    "age": 1,
    "visits": 570,
    "progress": 87,
    "status": "relationship"
  },
  {
    "firstName": "Nels",
    "lastName": "Ferry",
    "age": 36,
    "visits": 747,
    "progress": 55,
    "status": "single"
  },
  {
    "firstName": "Naomie",
    "lastName": "Bradtke",
    "age": 28,
    "visits": 807,
    "progress": 52,
    "status": "complicated"
  },
  {
    "firstName": "Rose",
    "lastName": "Leannon",
    "age": 0,
    "visits": 212,
    "progress": 96,
    "status": "complicated"
  },
  {
    "firstName": "Clara",
    "lastName": "Bailey",
    "age": 27,
    "visits": 694,
    "progress": 42,
    "status": "complicated"
  }
]
