import Form from '../components/form';

function Index() {
	return (
		<>
			<div className="row justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row mb-3">
						<div className="col">
							<Form />
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					{/* <TimelineContainer /> */}
				</div>
			</div>
		</>
	);
}

export default Index;
