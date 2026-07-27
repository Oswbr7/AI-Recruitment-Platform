const [open, setOpen] = useState(false);

    const handleCreateJob = async () => {

        console.log("Create");

        setOpen(false);

    };

    return (

        <div className="space-y-8">

            <JobToolbar

                onCreateJob={() => setOpen(true)}

            />

            {/* Aquí irá JobTable */}

            <JobSheet

                open={open}

                onOpenChange={setOpen}

                onSubmit={handleCreateJob}

            />

        </div>

    );