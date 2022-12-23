$.ajaxSetup({
    headers: { 'X-CSRFToken': csrf_token },
    type: 'POST',
});
$(document).ready(function() {

    $('#submit').click(function(){
        var input = $('#search_input').serialize();
        console.log(input)
        $.ajax({
            url: 'ajax_search/',
            data: $('#search_input').serialize(),
            success: function(response){
                let feature = response.feature
                $('#Answer').html(response.table);
                /*--------add column------*/
                let trs = document.querySelectorAll('#result_table tr');

                for (let tr of trs) {
                    let td = document.createElement('td');
                    tr.appendChild(td);
                }
                /*--------add column------*/

                $('#result_table').DataTable({
                    'columnDefs':[
                        {   'targets':-1,
                            render:function(data,type,row,meta){
                                return `<a href = "/yeast/browse/associated/?id=${row[0]}&name=${feature}"> Detail </a>`;
                            },
                        },
                    ]
                });
            },

            error: function(){
                alert('Something error');
            },
        })
    })
})