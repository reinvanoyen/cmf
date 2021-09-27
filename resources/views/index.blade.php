@extends('cmf::base')

@section('title', $cmf->getTitle())

@section('body')

    <div class="cmf-mount" data-title="{{ $cmf->getTitle() }}"></div>

@endsection
