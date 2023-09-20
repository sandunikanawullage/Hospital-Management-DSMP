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


const loadDoctors=()=>{
    $('#table-body').empty();
    const firestore = firebase.firestore();
    firestore
        .collection('doctors')
        .get().then((result)=>{
            result.forEach((records)=>{
                const data = records.data();
                const row=`
                <tr>
                    <th>${records.id}</th>
                    <td>${data.name}</td>
                    <td>${data.specialization}</td>
                    <td>${data.contact}</td>
                    <td>${data.availability}</td>
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

createDoctor=()=>{
    const tempDoctor={
        name:$('#name').val(), 
        specialization:$('#specialization').val(),
        contact:$('#contact').val(),
        availability:$('#available').val()
    };
    const database=firebase.firestore();
    database
    .collection("doctors")
    .add(tempDoctor)
    .then((response)=>{
        closePopup();
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';
        toastr.success('Added!', 'Success!')
        loadDoctors();
    })
    .catch((error)=>{
        alert("Error")
        console.log(error);
    })
}
doctorId=undefined;
const updateData=(id)=>{
    doctorId=id;
    const firestore = firebase.firestore();
    firestore
        .collection('doctors')
        .doc(doctorId)
        .get().then((response)=>{
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name), 
                $('#specialization').val(data.specialization),
                $('#contact').val(data.contact),
                $('#available').val(data.availability),
                openPopUpEdit();
            }
    })
}
const updateRecord=()=>{
    if (doctorId){
        const firestore = firebase.firestore();
        firestore
            .collection('doctors')
            .doc(doctorId)
            .update({
                name:$('#name').val(), 
                specialization:$('#specialization').val(),
                contact:$('#contact').val(),
                availability:$('#available').val()
            }).then(()=>{
            doctorId=undefined;
            closePopup();
            toastr.options.closeMethod = 'fadeOut';
            toastr.options.closeDuration = 300;
            toastr.options.closeEasing = 'swing';
            toastr.success('Edit!', 'success!')
            loadDoctors();
            
        })
    }
}

const deleteData=(id)=>{
    if (confirm('Are you sure?')){
        const firestore = firebase.firestore();
        firestore
            .collection('doctors')
            .doc(id)
            .delete()
            .then(()=>{

                toastr.options.closeMethod = 'fadeOut';
                toastr.options.closeDuration = 300;
                toastr.options.closeEasing = 'swing';
                toastr.success('Deleted!', 'Success!')
                doctorId=undefined;
                loadDoctors();
            })
    }
}

