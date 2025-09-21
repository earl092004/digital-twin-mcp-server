import json
from upstash_vector import Index

# Initialize
index = Index(
    url='https://engaged-slug-32449-us1-vector.upstash.io',
    token='AATYASQgZjMwYjU5OTQtMzYwMC00ODYzLTk4ODEtNjgwNTg1ODMyNDU1ZmM5NDUwZDU0YzJhNGI3YmEzNWNlOTQxZGFhN2Q0OTE='
)

# Query for sports
question = 'What sports do you play?'
print(f'🔍 Question: {question}')
results = index.query(data=question, top_k=2, include_metadata=True)

print(f'\n📊 Found {len(results)} results')
for i, result in enumerate(results, 1):
    print(f'\n--- Result {i} ---')
    print(f'ID: {result.id}')
    print(f'Score: {result.score:.3f}')
    print(f'Result type: {type(result)}')
    print(f'Result attributes: {[attr for attr in dir(result) if not attr.startswith("_")]}')
    
    # Check if result has data attribute
    if hasattr(result, 'data'):
        print(f'Data: {result.data}')
    else:
        print('No data attribute found')
    
    # Check if result has vector attribute
    if hasattr(result, 'vector'):
        print(f'Vector: {result.vector}')
    else:
        print('No vector attribute found')
    
    if result.metadata:
        print(f'Metadata title: {result.metadata.get("title", "N/A")}')
        print(f'Metadata keys: {list(result.metadata.keys())}')
        
    # Print the entire object structure
    print(f'Full result: {result.__dict__}')