## Prisma

### Cascade delete
#### 1 to 1
###### Foreign Key
The relation annotation and the foreign key go to the _subordinate_ side of the relation i.e. the relation whose records will be automatically deleted when the corresponding records in the _superior_ relation are deleted (by an external event). If an *Agent* is deleted so will the corresponding *Profile* and if a *Profile* is deleted so will the corresponding *Avatar*.