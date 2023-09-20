const popup=document.getElementById('pop-up')
const addNew=document.getElementById('addnew')
const Edit=document.getElementById('edit')
const Submit=document.getElementById('submit')

const closePopup=()=>{
    popup.style.display='none'
    addNew.style.display='block'
}

const openPopup=()=>{
    popup.style.display='flex'
    addNew.style.display='none'
    Submit.style.display='block'
    Edit.style.display='none'
}

const openPopUpEdit=()=>{
    popup.style.display='flex'
    addNew.style.display='none'
    Submit.style.display='none'
    Edit.style.display='block'

}

const loadPatient=()=>{
     $('#table-body').empty();
     const firestore = firebase.firestore();
     firestore
         .collection('patients')
         .get().then((result)=>{
             result.forEach((records)=>{
                 const data = records.data();
                 const row=`
                 <tr>
                     <th>${records.id}</th>
                     <td>${data.name}</td>
                     <td>${data.age}</td>
                     <td>${data.gender}</td>
                     <td>${data.contact}</td>
                     <td>${data. medicalHistory}</td>
                     <td>
                         <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')">Delete</button> |
                         <button class="btn btn-success btn-sm" onclick="updateData('${records.id}')">Update</button>
                     </td>
                 </tr>
                 `;
                 $('#table-body').append(row);
             });
     });
  
 }

createPatient=()=>{
    const tempPatient={
        name:$('#name').val(), 
        age:$('#age').val(),
        gender:$('#gender').val(),
        contact:$('#contact').val(),
        medicalHistory:$('#medicileHistory').val()
    };
    console.log(tempPatient);
    const database=firebase.firestore();
    database
    .collection("patients")
    .add(tempPatient)
    .then((response)=>{
        closePopup();
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';
        toastr.success('Added!', 'Success!')
        
    })
    .catch((error)=>{
        alert("error")
        console.log(error);
    })
}

patientId=undefined;
const updateData=(id)=>{
    patientId=id;
    const firestore = firebase.firestore();
    firestore
        .collection('patients')
        .doc(patientId)
        .get().then((response)=>{
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name), 
                $('#age').val(data.age),
                $('#gender').val(data.gender),
                $('#contact').val(data.contact),
                $('#medicileHistory').val(data.medicalHistory)
                openPopUpEdit();
            }
    })
}

const updateRecord=()=>{
    if (patientId){
        const firestore = firebase.firestore();
        firestore
            .collection('patients')
            .doc(patientId)
            .update({
                name:$('#name').val(), 
                age:$('#age').val(),
                gender:$('#gender').val(),
        contact:$('#contact').val(),
        medicalHistory:$('#medicileHistory').val()
            }).then(()=>{
            patientId=undefined;
            closePopup();
            toastr.options.closeMethod = 'fadeOut';
            toastr.options.closeDuration = 300;
            toastr.options.closeEasing = 'swing';
            toastr.success('Edit!', 'Success!')
            loadPatient()
            
        })
    }
}

const deleteData=(id)=>{
    if (confirm('Are you sure?')){
        const firestore = firebase.firestore();
        firestore
            .collection('patients')
            .doc(id)
            .delete()
            .then(()=>{

                toastr.options.closeMethod = 'fadeOut';
                toastr.options.closeDuration = 300;
                toastr.options.closeEasing = 'swing';
                toastr.success('Deleted!', 'Success!')
                patientId=undefined;
                loadPatient()
            })
    }
}

const printData=(i)=>{
    window.open('../pages/patientReport.html');
}

